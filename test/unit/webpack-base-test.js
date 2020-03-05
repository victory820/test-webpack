const assert = require('assert')

describe('base.js test case', () => {
  const baseConfig = require('../../lib/webpack.base')

  console.log(baseConfig)

  // 第一个参数是对功能的描述
  it('entry', () => {
    assert.equal(baseConfig.entry.index.indexOf('stand/test/smoke/template/src/index/index.js') > -1, true)
    assert.equal(baseConfig.entry.search.indexOf('stand/test/smoke/template/src/search/index.js') > -1, true)
  })

})