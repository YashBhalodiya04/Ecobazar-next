export const apis = {
  AUTH: {
    login: "/signin",
    register: "/signup",
  },
  USER: {
    getProfile: "/auth/user/profile",
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
    getHomeData: '/gethomedata'
  }
};
