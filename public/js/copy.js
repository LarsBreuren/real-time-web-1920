document.getElementById("copyIdButton").addEventListener("click", copyId); 

function copyId() {
    /* Get the text field */
    var copyText = document.getElementById("search_id");
  
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
  
    /* Alert the copied text */
    alert("Copied your id: " + copyText.value);
  } 