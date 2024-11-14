const onError = (socket) => (err) => {
  console.error('Socket error:', err);
};

export default onError;
