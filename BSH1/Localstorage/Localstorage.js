// Localstorage.js
document.getElementById("save-btn").addEventListener("click", () => {
    const value = document.getElementById("storage-input").value;
    localStorage.setItem("myValue", value);
    alert("값이 저장되었습니다!");
});

document.getElementById("load-btn").addEventListener("click", () => {
    const saved = localStorage.getItem("myValue");
    document.getElementById("storage-output").textContent = saved
        ? `저장된 값: ${saved}`
        : "저장된 값이 없습니다.";
});
