export function disableButtons(){
    var buttonsDelete = document.querySelectorAll('ul.list button.btn-delete')
    var buttonsWrite = document.querySelectorAll('ul.list button.btn-list-write')
    var checkBox = document.getElementById("batchCheck");
    var buttonInDiv = document.getElementById("btn-write");
    if(checkBox.checked == true) {
      buttonsWrite.forEach((button) => {button.disabled = true;});
      buttonsDelete.forEach((button) => {button.disabled = true;});
      buttonInDiv.disabled = true;
    }
}