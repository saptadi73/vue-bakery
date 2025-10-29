<template>
  <div class="item-card">
    <div class="form-group product-group">
      <label>Product Name</label>
      <input
        v-model="productNameQuery"
        @input="onProductNameInput"
        type="text"
        placeholder="Type product name..."
        class="form-control"
      />
      <input v-model="product_id" type="hidden" />
      <ul v-if="showSuggestions && suggestions.length" class="suggestions-list">
        <li
          v-for="product in suggestions"
          :key="product.id"
          @click="selectProduct(product)"
          class="suggestion-item"
        >
          {{ product.nama }} - {{ product.category ? product.category.nama : 'No Category' }}
        </li>
      </ul>
    </div>
    <div class="form-group category-group">
      <label>Category</label>
      <input
        v-model="categoryQuery"
        @input="onCategoryInput"
        type="text"
        placeholder="Type category name..."
        class="form-control"
      />
    </div>
    <div class="form-group quantity-group">
      <label>Quantity</label>
      <input v-model="quantity" type="number" min="1" class="form-control" />
    </div>

    <input v-model="outlet_id" type="hidden" />
    <input v-model="pic" type="hidden" />
    <button type="button" @click="$emit('remove-item')" class="remove-item-btn">Remove</button>
  </div>
</template>

<script>
import axios from 'axios'
import { BASE_URL } from '../base.utils.url.ts'

export default {
  name: 'ItemCard',
  props: {
    initialProductId: {
      type: [String, Number],
      default: '',
    },
    initialOutletId: {
      type: [String, Number],
      default: '',
    },
    initialQuantity: {
      type: Number,
      default: 1,
    },
    initialPic: {
      type: String,
      default: '',
    },
    initialProductName: {
      type: String,
      default: '',
    },
    initialCategoryName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      product_id: '',
      outlet_id: '',
      quantity: 1,
      pic: '',
      productNameQuery: '',
      categoryQuery: '',
      suggestions: [],
      showSuggestions: false,
      debounceTimer: null,
    }
  },
  mounted() {
    this.product_id = this.initialProductId || ''
    this.outlet_id = this.initialOutletId || localStorage.getItem('outlet_id') || ''
    this.quantity = this.initialQuantity || 1
    this.pic = this.initialPic || localStorage.getItem('username') || ''
    this.productNameQuery = this.initialProductName || ''
    this.categoryQuery = this.initialCategoryName || ''
  },
  methods: {
    onProductNameInput() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.fetchProducts()
      }, 300)
    },
    async fetchProducts() {
      const hasProductQuery = this.productNameQuery.trim()
      const hasCategoryQuery = this.categoryQuery.trim()
      if (!hasProductQuery && !hasCategoryQuery) {
        this.suggestions = []
        this.showSuggestions = false
        return
      }
      try {
        const response = await axios.get(`${BASE_URL}products`)
        const products = response.data.data
        this.suggestions = products.filter((product) => {
          const matchesName = hasProductQuery
            ? product.nama.toLowerCase().includes(this.productNameQuery.toLowerCase())
            : true
          const matchesCategory = hasCategoryQuery
            ? product.category &&
              product.category.nama.toLowerCase().includes(this.categoryQuery.toLowerCase())
            : true
          return matchesName && matchesCategory
        })
        this.showSuggestions = true
      } catch (error) {
        console.error('Error fetching products:', error)
        this.suggestions = []
        this.showSuggestions = false
      }
    },
    selectProduct(product) {
      this.product_id = product.id
      this.productNameQuery = product.nama
      this.categoryQuery = product.category ? product.category.nama : ''
      this.showSuggestions = false
    },
    onCategoryInput() {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.fetchProducts()
      }, 300)
    },
  },
}
</script>

<style scoped>
.item-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: #fff;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.product-group {
  flex: 1;
  min-width: 200px;
}

.category-group {
  flex: 1;
  min-width: 200px;
}

.quantity-group {
  flex: 0 0 120px;
  min-width: 120px;
}

.form-group {
  margin-bottom: 12px;
  position: relative;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.suggestion-item:hover {
  background: #f5f5f5;
}

.remove-item-btn {
  background: #f44336;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  font-size: 16px;
}

.remove-item-btn:hover {
  background: #d32f2f;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .item-card {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }

  .product-group,
  .category-group {
    min-width: unset;
    flex: 1;
  }

  .quantity-group {
    flex: 0 0 100%;
    min-width: unset;
  }

  .form-control {
    font-size: 16px; /* Prevent zoom on iOS */
    padding: 10px 12px;
  }

  .remove-item-btn {
    padding: 12px 16px;
    font-size: 16px;
  }

  .suggestions-list {
    max-height: 150px;
  }
}

@media (max-width: 480px) {
  .item-card {
    padding: 10px;
    margin-bottom: 12px;
  }

  .form-group {
    margin-bottom: 10px;
  }

  .form-control {
    padding: 12px;
  }

  .remove-item-btn {
    padding: 14px 16px;
  }
}
</style>
