
describe('.transform()', function () {
  it('export-bindings', function () {
    var ast = read('export-bindings')
    var m = Module(ast)
    m.transform()
    var result = recast.print(m.ast)
    var context = vm.createContext()
    vm.runInThisContext(vmExports, context)
    vm.runInThisContext(result.code, context)
    vm.runInThisContext('if (exports.a !== 1) throw new Error()', context)
    vm.runInThisContext('exports.update()', context)
    vm.runInThisContext('if (exports.a !== 2) throw new Error()', context)
  })

  it('underscoreish', function () {
    var ast = read('underscoreish')
    var m = Module(ast)
    m.transform()
    var result = recast.print(m.ast)
    assert(!~result.code.indexOf('return x'))
    assert(!~result.code.indexOf('return y'))
    assert(~result.code.indexOf('__$mod_y.x'))
    assert(~result.code.indexOf('__$mod_r.y'))
    var context = vm.createContext()
    vm.runInThisContext(vmExports, context)
    vm.runInThisContext(vmRequire, context)
    vm.runInThisContext(result.code, context)
    vm.runInThisContext('if (typeof exports.default !== "function") throw new Error()')
    vm.runInThisContext('if (typeof exports.a !== "function") throw new Error()')
    vm.runInThisContext('if (typeof exports.b !== "function") throw new Error()')
  })

  it('jade', function () {
    var ast = read('jade')
    var m = Module(ast)
    m.transform()
    var result = recast.print(m.ast)
    var context = vm.createContext()
    vm.runInThisContext(vmExports, context)
    vm.runInThisContext(vmRequire, context)
    vm.runInThisContext(result.code, context)
    vm.runInThisContext('if (typeof exports.default !== "function") throw new Error()')
  })
})
