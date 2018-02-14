function readURL(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader()
    reader.onload = function(e) {
      $('.Add-body').css({'background-image':'url("' + e.target.result + '")', 'background-size': '350px 350px'})
    }
    reader.readAsDataURL(input.files[0])
  }
}

$("input[type=file]").on('change',function(){
    readURL(this)
    $('p')[0].innerHTML = ""
});
