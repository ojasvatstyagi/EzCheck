const VisitorAPI = (() => {
  const STORAGE_KEY = "mock_visitors";

  const getAll = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  };

  const saveAll = (visitors) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));
  };

  const registerVisitor = async (visitorData) => {
    const visitors = getAll();
    const id = `V${Date.now()}`;
    visitors.push({ id, ...visitorData });
    saveAll(visitors);
    return { success: true, id };
  };

  const uploadFile = async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url: `assets/uploads/${file.name}`, // mock file URL
        });
      }, 500);
    });
  };

  return {
    registerVisitor,
    uploadFile,
    getAllVisitors: getAll,
  };
})();
