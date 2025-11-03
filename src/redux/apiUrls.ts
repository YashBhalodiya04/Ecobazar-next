export const apis = {
  AUTH: {
    login: "/signin",
    register: "/signup",
    contactus: "/contactussendemail",
    logout: "/auth/logout"
  },
  USER: {
    getProfile: "/auth/user/profile",

    addProductReview: '/auth/user/createreview',
    removeFromCart: '/auth/user/usercart/removefromcart',
    addToCart: '/auth/user/usercart/addtocart',
    getCart: '/auth/user/usercart/getcartdetail',
  },
  ADMIN: {  
    // CATEGORY
    createCategory: "/auth/admin/category/createcategory",
    getCategory: "/auth/admin/category/getcategory",
    deleteCategory: "/auth/admin/category/deletecategory",
    categoryDropdown: "/auth/admin/product/getallcategory",

    // SLIDER
    createSlider: "/auth/admin/slider/saveslider",
    getSlider: "/auth/admin/slider/getsliders",
    deleteSlider: "/auth/admin/slider/deleteslider",

    // PRODUCT
    saveProduct: "/auth/admin/product/createproduct",
    getProduct: "/auth/admin/product/getproduct",
    deleteProduct: "/auth/admin/product/deleteproduct",
  },
  WITHOUTTOKEN: {
    getHomeData: '/gethomedata',

    // CATEGORY
    getAllCategoryList: '/category/getallcategorylist',
    getProductList: '/product/getallproduct',
    getProductDetails: '/product/productdetail',
  }
};
