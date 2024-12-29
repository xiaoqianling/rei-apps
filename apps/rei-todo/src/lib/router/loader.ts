export const testLoader = () => {
  return Promise.resolve(() => {
    return { message: "Hello Data Router!" };
  });
};
