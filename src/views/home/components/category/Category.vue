<template>
  <div>
    <el-row>
      <h3 class="header">商品分类</h3>
    </el-row>
    <el-row class="classify-container">
      <el-tabs
        :tab-position="tabPosition"
        :lazy="true"
        @tab-click="getProductById"
        class="hhh"
      >
        <el-tab-pane
          v-for="category in categories"
          :key="category.categoryId"
          :label="category.categoryName"
          class="tab-pane"
        >
          <div class="card-bd">
            <CategoryCard
              v-for="(item, index) in products"
              :key="index"
              :product="item"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import request from '../../../../utils/request'
const CategoryCard = () => import('./CategoryCard.vue')

export default {
  data() {
    return {
      tabPosition: 'left',
      closable: false,
      currentDate: new Date(),
      categories: [],
      products: []
    }
  },
  components: {
    CategoryCard
  },
  methods: {
    getProductById(tab) {
      // 根据商品类 category id 请求此类所有商品数据
      let queryCategoryId = this.categories[Number(tab.index)].categoryId
      // 清空原来的元素
      this.products = []
      request
        .get('/category/' + queryCategoryId)
        .then((res) => {
          res.forEach((e) => {
            this.products.push(e)
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    test() {
      console.log(111)
    }
  },
  created() {
    request
      .get('/category/all')
      .then((res) => {
        res.forEach((e) => {
          this.categories.push(e)
        })
      })
      .catch((err) => {
        console.log(err)
      })
      .then(() => {
        // 刷新页面则请求分类第一条
        this.getProductById({ index: 0 })
      })
  }
}
</script>

<style scoped>
.header {
  height: 60px;
  line-height: 80px;
}
h3 {
  font-weight: 400;
}
.right {
  background-color: #b3d8ff;
}
.classify-container {
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}
.image {
  margin-left: 50%;
  width: 65%;
  transform: translate(-50%);
  display: block;
}
/* .card {
  width: 200px;
  height: 220px;
  transition: all 0.2s;
  margin-top: 10px;
  margin-left: 20px;
  padding-top: 0;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.card:hover {
  transform: scale(1.05);
} */

.card-bd {
  width: 100%;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}

.tab-pane {
  padding-right: 0;
}
.a-card {
  width: 80px;
}
</style>