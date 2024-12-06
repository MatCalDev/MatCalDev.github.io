var check = document.querySelector(".check");
check.addEventListener('click', idioma);

function idioma() {
	let id = check.checked;
	if (id == true) {
		location.href = "/indexEN.html";
	} else {
		location.href = "/index.html";
	}
}

type = "text/javascript">
	window.addEventListener("scroll", function () {
		var header = document.querySelector("header");
		header.classList.toggle("abajo", window.scrollY > 0);
	})

typeidioma = "text/javascript">
	window.addEventListener("scroll", function () {
		var idiomas = document.querySelector(".idiomas");
		idiomas.classList.toggle("abajo", window.scrollY > 0);
	})