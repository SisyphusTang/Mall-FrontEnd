<template>
  <div
    style="
      width: 80%;
      margin-left: 50%;
      transform: translate(-50%);
      margin-bottom: 20px;
    "
  >
    <h3 class="header">
      <span class="header-span"> 订单结算页面 </span>
    </h3>
    <div class="sub-header">
      <h4><i class="fas fa-list-ul"></i> 商品列表</h4>
    </div>

    <el-row type="flex">
      <el-col :span="8" class="item-header">商品图片</el-col>
      <el-col :span="8" class="item-header">商品名称</el-col>
      <el-col :span="8" class="item-header">价格 x 数量</el-col>
    </el-row>
    <div class="list-bd">
      <CheckoutItem
        v-for="(product, index) in products"
        :key="index"
        :cProduct="product"
      />
    </div>
    <div class="info-bd">
      <el-row type="flex" justify="end">
        <el-col :span="4" class="bottom-item" style="color: #999">
          寄送至：{{ address }}
        </el-col>
        <el-col :span="4" class="bottom-item" style="color: #999">
          收件人：{{ realName }}
        </el-col>
        <el-col :span="10"></el-col>
        <el-col :span="3" class="bottom-item">共 {{ total }} 件</el-col>
        <el-col :span="5" class="bottom-item"
          >商品原总价：￥{{ originPrice }}
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-col :span="4" class="bottom-item bb"
          >已优惠： ￥{{ (originPrice - this.money).toFixed(2) }}
        </el-col>
        <el-col :span="5" class="bottom-item bb"
          >应付金额：
          <span class="m"> ￥{{ this.money.toFixed(2) }} </span>
        </el-col>
      </el-row>
    </div>
    <el-row type="flex" justify="end" style="margin-top: 10px">
      <el-button type="info" @click="cancel">取消订单</el-button>
      <el-button type="success" @click="submit">提交订单</el-button>
    </el-row>
  </div>
</template>

<script>
import request from '../../utils/request'
import CheckoutItem from './CheckoutItem.vue'
export default {
  data() {
    return {
      products: [],
      total: 0,
      money: 0,
      address: '',
      realName: '',
      timer: null,
      shopId: null
    }
  },
  created() {
    let items = JSON.parse(sessionStorage.getItem('checkout'))
    this.products = items.cartProducts
    this.getShopId()
    this.total = items.total
    this.money = items.money
    let uId = sessionStorage.getItem('userId')
    request.get('/user/' + uId).then((res) => {
      this.realName = res.data.realName
      this.address = res.data.address
    })
  },
  components: {
    CheckoutItem
  },
  computed: {
    originPrice() {
      return this.products
        .reduce((preV, curP) => preV + curP.productPrice * curP.count, 0)
        .toFixed(2)
    }
  },
  methods: {
    cancel() {
      sessionStorage.removeItem('checkout')
      this.$router.back()
    },
    getShopId() {
      request
        .get('/shop/product_id/' + this.products[0].productId)
        .then((res) => {
          this.shopId = res
        })
    },
    submit() {
      let uId = sessionStorage.getItem('userId')
      // 产生订单号
      let orderN = this.randomNo()
      let orderMaster = {
        orderNumber: orderN,
        buyerId: uId,
        orderAmount: this.money.toFixed(2),
        shopId: this.shopId
      }
      let flag = 1
      request
        .post('/order/master', orderMaster)
        .then((res) => {
          if (res.code !== '0') {
            flag = 0
          }
        })
        .catch((err) => {
          console.log(err)
        })
      // 对订单中每一天商品信息进行存储
      this.products.forEach((p) => {
        let item = {
          orderNumber: orderN,
          productId: p.productId,
          count: p.count
        }
        console.log(item)
        request
          .post('/order/detail', item)
          .then((res) => {
            if (res.code === '0') {
              console.log(res.msg)
            } else {
              flag = 0
            }
          })
          .catch((err) => {
            flag = 0
            console.log(err)
          })
      })
      if (flag) {
        this.$message({
          message: '订单提交成功!',
          type: 'success',
          duration: 1000
        })
        // 清除本地存储中的订单信息
        sessionStorage.removeItem('checkout')
        // 清空购物车
        request
          .delete('/cart/all/' + uId)
          .then((res) => {
            console.log(res.msg)
          })
          .catch((err) => {
            console.log(err)
          })
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$router.push('/submit_success')
        }, 1000)
      }
    },
    // 当前时间序列+6位随机数产生订单号
    randomNo(j = 6) {
      let randomNo = ''
      for (let i = 0; i < j; i++) {
        randomNo += Math.floor(Math.random() * 10)
      }
      let newD = new Date()
      let y = newD.getFullYear()
      let m = newD.getMonth() + 1
      let d = newD.getDate()
      let h = newD.getHours()
      let mi = newD.getMinutes()
      let s = newD.getSeconds()
      let arr = [y, m, d, h, mi, s]
      arr.forEach((e, i) => {
        if (e < 10) {
          arr[i] = '0' + e
        }
      })
      let newDateNo = arr.join('')
      randomNo = newDateNo + randomNo
      return randomNo
    }
  }
}
</script>

<style scoped>
.header {
  height: 50px;
  line-height: 60px;
  font-weight: 400;
}
.header-span {
  border-bottom: 1px solid rgba(204, 204, 204, 0.5);
}
.sub-header {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
}
h3,
h4 {
  font-weight: 400;
}
.list-bd {
  border-top: 1px solid rgba(204, 204, 204, 0.5);
  margin-top: 10px;
  margin-bottom: 20px;
}
.item-header {
  text-align: center;
}
.bottom-item {
  /* border-bottom: 1px solid rgba(204, 204, 204, 0.5); */
  font-size: 15px;
}
.bb {
  height: 40px;
  line-height: 40px;
}
.m {
  font-size: 20px;
  color: #e4393c;
  font-weight: 700;
}
.info-bd {
  border-top: 1px solid rgba(204, 204, 204, 0.5);
  background-color: #f4f4f4;
  padding: 5px;
  padding-left: 20px;
}
</style>