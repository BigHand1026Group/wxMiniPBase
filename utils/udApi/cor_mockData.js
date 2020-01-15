// 假数据请求

var commonData = {
  res: { status: 0 },
  inf: { data: [] }
};
var mockData = {
  'wx/user!ajaxGetMyInfo.action': {
    inf: {
      area: '东城区',
      score: 0,
      province: '北京市',
      city: '北京市',
      name: 'cor5',
      useMoney: 10000,
      deposit: 10,
      tel: '18011719245',
      addr: '2333',
      enterpriseName: '234',
      email: '1057373333@qq.com',
      masterStatus: 1
    },
    res: { status: 0 }
  },
  'wx/address!ajaxGetList.action':{"inf":{"data":[{"area":"海珠区","isDefault":0,"address":"新港中路397号","province":"广东省","city":"广州市","post_code":"000000","name":"张三","mobile":"020-81167888","sortNum":0,"id":"2c9272c16ddced86016ddd0a7a3459c8"},{"area":"海珠区","isDefault":0,"address":"新港中路397号","province":"广东省","city":"广州市","post_code":"000000","name":"张三2","mobile":"18011719245","sortNum":0,"id":"2c9272c16df19898016df283b0db06d8"}]},"res":{"errMsg":"","status":0}},
  'weixin!uploadUserInfo.action': {
    inf: { unionId: 'undefined', openId: 'okgZI45q8_mDKkFQONPDT3z4BdrE' },
    res: { status: 0 }
  },
  'common!ajaxGetServiceCatalog.action': {
    inf: {
      arr: [
        {
          arr: [
            {
              arr: [
                { arr: [{ name: '安装' }], name: '4K超清电视' },
                { arr: [{ name: '检修' }], name: 'OLED电视' }
              ],
              name: '电视机'
            },
            {
              arr: [{ arr: [{ name: '清洗' }], name: '挂式机' }],
              name: '空调'
            },
            {
              arr: [{ arr: [{ name: '免拆清洗' }], name: '储水式' }],
              name: '热水器'
            }
          ],
          name: '家电类'
        },
        {
          arr: [{ arr: [{ arr: [{ name: '4' }], name: '3' }], name: '2' }],
          name: '1'
        }
      ]
    },
    res: { status: 0 }
  },
  'common!ajaxGetSpecSkill.action': {
    inf: { arr: [{ name: '检修1' }] },
    res: { status: 0 }
  },
  'wx/user!ajaxGetAuthInfo.action': {
    inf: {
      serviceType:
        '家电类-电视机-4K超清电视|家电类-电视机-OLED电视|家电类-空调-挂式机|家电类-空调',
      serviceArea:
        '北京市-北京市-东城区-东华门街道|北京市-北京市-东城区-东华门街道',
      insureStartTime: '2019-12-21',
      idCard:
        'http://attachments.gfan.com/forum/attachments2/201301/29/1256236ax4jx99h0m2amxm.jpg|http://img4.imgtn.bdimg.com/it/u=1703094090,802953328&fm=26&gp=0.jpg',
      masterType: 2,
      authImg: '',
      isExpress: 0,
      masterStatus: 1,
      threeUpPrice: 0,
      bussinessLicense:
        'http://file.mumayi.com/forum/201401/16/202014h22z6jt6vpajypd0.jpg',
      insureImg: '',
      carNo: '',
      insureEndTime: '2019-12-23',
      isCarry: 0,
      threeDownPrice: 0,
      specSkill: [
        {
          specSkillStartTime: '2019-12-20',
          specSkillImg:
            'http://b-ssl.duitang.com/uploads/item/201406/22/20140622144748_2PvLa.jpeg;http://f.hiphotos.baidu.com/zhidao/pic/item/aa18972bd40735fa3331701e9c510fb30e240857.jpg',
          name: '检修1',
          specSkillEndTime: '2019-12-22',
          specSkillInsure:
            'http://b.zol-img.com.cn/soft/5/872/ceXvmliL01NeQ.jpg;http://img4.imgtn.bdimg.com/it/u=3127508304,2196347646&fm=214&gp=0.jpg'
        }
      ]
    },
    res: {
      status: 0
    }
  }
};
function mockFN(url) {
  // 拦截请求的函数方法
  if (mockData[url]) {
    return mockData[url];
    // return commonData
  } else {
    commonData.tip = '该路径mock数据为空';
    return commonData;
  }
}
module.exports = {
  mockFN: mockFN
};
