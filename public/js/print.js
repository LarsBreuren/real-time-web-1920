let printsheet = document.getElementById("print")
    printsheet.addEventListener("click", printPage);

    function printPage(){
        window.print();
    }
