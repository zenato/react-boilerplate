const authConfig = accessToken => ({
  headers: { Authorization: `Bearer ${accessToken}` },
});

const formatError = (error) => {
  if (error.response) {
    return {
      message: error.message,
      status: error.response.status,
      data: error.response.data,
    };
  }
  return {
    message: error.message,
    status: null,
  };
};

export {
  authConfig,
  formatError,
};
