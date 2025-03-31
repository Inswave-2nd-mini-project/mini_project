const signupButton = document.getElementById('signup-button'),
    loginButton = document.getElementById('login-button'),
    userForms = document.getElementById('user_options-forms')

signupButton.addEventListener('click', () => {
  userForms.classList.remove('bounceRight')
  userForms.classList.add('bounceLeft')
}, false)

loginButton.addEventListener('click', () => {
  userForms.classList.remove('bounceLeft')
  userForms.classList.add('bounceRight')
}, false)

// 네비게이션
fetch('../navi/navi.html')
.then(response => response.text())
.then(data => {
  document.getElementById('navi-container').innerHTML = data;
})
.catch(error => console.error('Error loading navi:', error));