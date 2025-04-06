// 네비게이션
fetch('../navi/navi.html')
.then(response => response.text())
.then(data => {
    document.getElementById('navi-container').innerHTML = data;
})
.catch(error => console.error('Error loading navi:', error));