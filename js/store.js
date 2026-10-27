/* English Coach: profile storage. Pure functions over a Storage-like object (getItem/setItem/removeItem).
   Keys: ec_index_v2 (profile list), ec_profile_<id> (one learner state), ec_packs_v2 (content packs shared by all).
   The v1 key is read once for migration and never written or removed. */
(function () {
  'use strict';

  var V1 = 'english_coach_v1', INDEX = 'ec_index_v2', PACKS = 'ec_packs_v2', PREFIX = 'ec_profile_';
  var EMOJIS = ['🦊', '🐼', '🦉', '🐢', '🐬', '🌻', '🍀', '⭐', '🚀', '🎈', '🐝', '🍎'];
  var COLORS = ['#0f766e', '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#ca8a04', '#16a34a', '#475569'];

  function get(ls, k) { try { var r = ls.getItem(k); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function set(ls, k, v) { try { ls.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function now() { return new Date().toISOString(); }
  function newId() { return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function isObj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
  function stripPacks(state) { var c = Object.assign({}, state); delete c.packs; return c; }

  /* ---------- index ---------- */
  function index(ls) {
    var x = get(ls, INDEX);
    if (!isObj(x) || !Array.isArray(x.profiles)) return { profiles: [], active: null };
    return x;
  }
  function saveIndex(ls, x) { return set(ls, INDEX, x); }
  function meta(ls, id) { return index(ls).profiles.filter(function (p) { return p.id === id; })[0] || null; }
  function uniqueName(ls, name, exceptId) {
    var taken = index(ls).profiles.filter(function (p) { return p.id !== exceptId; }).map(function (p) { return p.name.toLowerCase(); });
    if (taken.indexOf(name.toLowerCase()) < 0) return name;
    for (var n = 2; ; n++) { var c = name + ' (' + n + ')'; if (taken.indexOf(c.toLowerCase()) < 0) return c; }
  }

  /* ---------- profiles ---------- */
  function loadProfile(ls, id, defaults) {
    var r = get(ls, PREFIX + id);
    return stripPacks(Object.assign(defaults, isObj(r) ? r : {}));
  }
  function saveProfile(ls, id, state) { return set(ls, PREFIX + id, stripPacks(state)); }
  /* Adds a profile with the given state. m: {name, emoji, color, created}. Returns the new meta. */
  function createProfile(ls, m, state) {
    var x = index(ls), n = x.profiles.length;
    var p = {
      id: newId(), name: uniqueName(ls, String(m.name || 'Profile ' + (n + 1)).trim()),
      emoji: m.emoji || EMOJIS[n % EMOJIS.length], color: m.color || COLORS[n % COLORS.length],
      created: m.created || now(), lastUsed: m.lastUsed || ''
    };
    saveProfile(ls, p.id, state);
    x = index(ls); x.profiles.push(p); if (!x.active) x.active = p.id; saveIndex(ls, x);
    return p;
  }
  function updateProfile(ls, id, patch) {
    var x = index(ls);
    x.profiles.forEach(function (p) {
      if (p.id !== id) return;
      if (patch.name !== undefined) p.name = uniqueName(ls, String(patch.name).trim(), id);
      if (patch.emoji) p.emoji = patch.emoji;
      if (patch.color) p.color = patch.color;
    });
    saveIndex(ls, x);
    return meta(ls, id);
  }
  function setActive(ls, id) {
    var x = index(ls);
    x.profiles.forEach(function (p) { if (p.id === id) p.lastUsed = now(); });
    x.active = id; saveIndex(ls, x);
  }
  function deleteProfile(ls, id) {
    var x = index(ls);
    x.profiles = x.profiles.filter(function (p) { return p.id !== id; });
    if (x.active === id) x.active = x.profiles.length ? x.profiles[0].id : null;
    saveIndex(ls, x);
    try { ls.removeItem(PREFIX + id); } catch (e) { /* ignore */ }
  }

  /* ---------- shared content packs ---------- */
  function packs(ls) { var p = get(ls, PACKS); return Array.isArray(p) ? p : []; }
  function addPacks(ls, list) {
    var cur = packs(ls), seen = cur.map(function (p) { return JSON.stringify(p); });
    (list || []).forEach(function (p) { var s = JSON.stringify(p); if (isObj(p) && seen.indexOf(s) < 0) { cur.push(p); seen.push(s); } });
    return set(ls, PACKS, cur);
  }

  /* ---------- v1 migration ---------- */
  /* Runs only when no v2 index exists. Copies the v1 state into the first profile and leaves the v1 key in place. */
  function migrateV1(ls) {
    var hasIndex = false;
    try { hasIndex = ls.getItem(INDEX) !== null; } catch (e) { return null; }
    if (hasIndex) return null;
    var old = get(ls, V1);
    if (!isObj(old)) return null;
    addPacks(ls, Array.isArray(old.packs) ? old.packs : []);
    return createProfile(ls, { name: (old.name && String(old.name).trim()) || 'Profile 1', created: old.created ? old.created + 'T00:00:00.000Z' : now() }, old);
  }

  /* ---------- backup ---------- */
  var TYPES = { units: 'object', srs: 'object', skill: 'object', exams: 'object', mistakes: 'array', hist: 'array', days: 'array', writings: 'array', streak: 'object', xp: 'number', name: 'string', lang: 'string' };
  function typeOf(v) { return Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v; }
  /* A learner state must carry units, srs, hist and xp, and every known key must have the right type. */
  function stateProblem(s) {
    if (!isObj(s)) return 'not an object';
    var must = ['units', 'srs', 'hist', 'xp'].filter(function (k) { return !(k in s); });
    if (must.length) return 'missing ' + must.join(', ');
    var bad = Object.keys(TYPES).filter(function (k) { return k in s && typeOf(s[k]) !== TYPES[k]; });
    return bad.length ? 'wrong type for ' + bad.join(', ') : '';
  }
  function exportProfile(ls, id) {
    var m = meta(ls, id);
    return { app: 'english-coach', kind: 'profile', version: 2, exported: now(), profile: m, state: stripPacks(get(ls, PREFIX + id) || {}), packs: packs(ls) };
  }
  function exportAll(ls) {
    return {
      app: 'english-coach', kind: 'all', version: 2, exported: now(), active: index(ls).active, packs: packs(ls),
      profiles: index(ls).profiles.map(function (m) { return { profile: m, state: stripPacks(get(ls, PREFIX + m.id) || {}) }; })
    };
  }
  /* Returns { kind, items: [{ profile, state }], packs } or throws an Error whose .code names the problem. */
  function parseBackup(data) {
    function fail(code, detail) { var e = new Error(code + (detail ? ': ' + detail : '')); e.code = code; e.detail = detail || ''; throw e; }
    if (typeof data === 'string') { try { data = JSON.parse(data); } catch (e) { fail('notJson'); } }
    if (!isObj(data)) fail('unknownShape');
    var items = [], kind;
    if (data.app === 'english-coach' && data.version === 2 && (data.kind === 'profile' || data.kind === 'all')) {
      kind = data.kind;
      var raw = kind === 'profile' ? [{ profile: data.profile, state: data.state }] : data.profiles;
      if (!Array.isArray(raw) || !raw.length) fail('unknownShape', 'no profiles');
      raw.forEach(function (it, i) {
        if (!isObj(it) || !isObj(it.profile) || typeof it.profile.name !== 'string') fail('unknownShape', 'profile ' + (i + 1) + ' has no name');
        var pr = stateProblem(it.state); if (pr) fail('badState', it.profile.name + ': ' + pr);
        items.push({ profile: it.profile, state: stripPacks(it.state) });
      });
    } else if (!('app' in data) && !stateProblem(data)) {
      kind = 'v1';
      items.push({ profile: { name: (data.name && String(data.name).trim()) || 'Profile 1' }, state: stripPacks(data) });
    } else {
      fail('unknownShape', stateProblem(data));
    }
    return { kind: kind, items: items, packs: Array.isArray(data.packs) ? data.packs.filter(isObj) : [] };
  }
  /* mode 'new': every item becomes a new profile.
     mode 'replace': kind profile or v1 overwrites targetId; kind all overwrites profiles with the same id and adds the rest.
     Returns the ids written. */
  function importBackup(ls, parsed, mode, targetId) {
    var ids = [];
    addPacks(ls, parsed.packs);
    parsed.items.forEach(function (it) {
      var p = it.profile, target = null;
      if (mode === 'replace') target = parsed.kind === 'all' ? meta(ls, p.id) : meta(ls, targetId);
      if (target) {
        saveProfile(ls, target.id, it.state);
        updateProfile(ls, target.id, { name: p.name, emoji: p.emoji, color: p.color });
        ids.push(target.id);
      } else {
        ids.push(createProfile(ls, { name: p.name, emoji: p.emoji, color: p.color, created: p.created }, it.state).id);
      }
    });
    return ids;
  }

  var api = {
    KEYS: { V1: V1, INDEX: INDEX, PACKS: PACKS, PREFIX: PREFIX }, EMOJIS: EMOJIS, COLORS: COLORS,
    index: index, meta: meta, loadProfile: loadProfile, saveProfile: saveProfile, createProfile: createProfile,
    updateProfile: updateProfile, setActive: setActive, deleteProfile: deleteProfile,
    packs: packs, addPacks: addPacks, migrateV1: migrateV1,
    exportProfile: exportProfile, exportAll: exportAll, parseBackup: parseBackup, importBackup: importBackup, stateProblem: stateProblem
  };
  if (typeof window !== 'undefined') window.ECStore = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
