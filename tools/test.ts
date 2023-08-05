fetch('https://nftapi.mobox.io/auction/search/BNB?page=1&limit=30&category=&vType=&sort=-time&pType=')
  .then(response => response.json())
  .then(data => {
    // Xử lý dữ liệu ở đây
    console.log(data);
  })
  .catch(error => {
    // Xử lý lỗi ở đây
    console.error('Error fetching data:', error);
  });