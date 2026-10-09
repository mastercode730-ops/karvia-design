/* Karvia design runtime: renders a page's template with its Component logic.
   Supports {{path}} holes, <sc-for list as>, <sc-if value>, onClick handlers and setState. */
(function () {
  'use strict';

  function DCLogic(props) {
    this.props = props || {};
    this.state = {};
  }
  DCLogic.prototype.setState = function (patch) {
    var next = typeof patch === 'function' ? patch(this.state) : patch;
    this.state = Object.assign({}, this.state, next);
    render();
  };
  DCLogic.prototype.forceUpdate = function () { render(); };

  var tpl = document.getElementById('dc-tpl').textContent;
  var root = document.getElementById('dc-root');
  var code = document.querySelector('script[data-dc-script]').textContent;
  var Component = new Function('DCLogic', code + '\n;return Component;')(DCLogic);

  // Allow `class Component extends DCLogic` with an ES5 base.
  var instance = new Component({});
  var handlers = [];

  function lookup(path, scopes) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^'.*'$|^".*"$/.test(path)) return path.slice(1, -1);
    var parts = path.split('.');
    for (var i = scopes.length - 1; i >= 0; i--) {
      if (scopes[i] && Object.prototype.hasOwnProperty.call(scopes[i], parts[0])) {
        var v = scopes[i][parts[0]];
        for (var j = 1; j < parts.length && v != null; j++) v = v[parts[j]];
        return v;
      }
    }
    return undefined;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function holes(text, scopes) {
    return text.replace(/\{\{([^}]+)\}\}/g, function (_, p) {
      var v = lookup(p, scopes);
      if (typeof v === 'function') { handlers.push(v); return '__h' + (handlers.length - 1); }
      if (v == null) return '';
      return esc(v);
    });
  }

  function attr(openTag, name) {
    var m = openTag.match(new RegExp(name + '\\s*=\\s*"([^"]*)"'));
    return m ? m[1] : null;
  }

  function findClose(src, from, tag) {
    var depth = 1, re = new RegExp('<' + tag + '[\\s>]|</' + tag + '>', 'g'), m;
    re.lastIndex = from;
    while ((m = re.exec(src))) {
      if (m[0].charAt(1) === '/') { if (--depth === 0) return m.index; }
      else depth++;
    }
    throw new Error('Unclosed <' + tag + '>');
  }

  function renderStr(src, scopes) {
    var out = '', pos = 0, re = /<(sc-for|sc-if)\b[^>]*>/g, m;
    while ((m = re.exec(src))) {
      out += holes(src.slice(pos, m.index), scopes);
      var tag = m[1], open = m[0], bodyStart = m.index + open.length;
      var close = findClose(src, bodyStart, tag);
      var body = src.slice(bodyStart, close);
      if (tag === 'sc-for') {
        var list = lookup((attr(open, 'list') || '').replace(/[{}]/g, ''), scopes) || [];
        var as = attr(open, 'as') || 'item';
        for (var i = 0; i < list.length; i++) {
          var s = {}; s[as] = list[i]; s.$index = i;
          out += renderStr(body, scopes.concat([s]));
        }
      } else {
        if (lookup((attr(open, 'value') || '').replace(/[{}]/g, ''), scopes)) out += renderStr(body, scopes);
      }
      pos = close + tag.length + 3;
      re.lastIndex = pos;
    }
    return out + holes(src.slice(pos), scopes);
  }

  var source = tpl.replace(/\bonClick=/g, 'data-dc-click=');

  function render() {
    handlers = [];
    var vals = instance.renderVals ? instance.renderVals() : {};
    root.innerHTML = renderStr(source, [vals]);
    root.querySelectorAll('[data-dc-click]').forEach(function (el) {
      var h = handlers[Number((el.getAttribute('data-dc-click') || '').replace('__h', ''))];
      if (h) el.addEventListener('click', function (e) { e.preventDefault(); h(e); });
    });
  }

  document.addEventListener('submit', function (e) { e.preventDefault(); });
  render();
  if (instance.componentDidMount) instance.componentDidMount();
})();
