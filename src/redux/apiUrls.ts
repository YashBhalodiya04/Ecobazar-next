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

    // SLIDER
    createSlider: "/auth/admin/category/saveslider",
    getSlider: "/auth/admin/category/getslider",
  },
};
