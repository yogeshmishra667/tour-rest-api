/*eslint-disable */

export const handleFileSelect = evt => {
  const files = evt.target.files;
  const f = files[0];
  const reader = new FileReader();
  //console.log(evt);
  reader.onload = (function(theFile) {
    //console.log(theFile.name);
    return function(e) {
      document.getElementById('list').innerHTML = [
        `<img src= ${e.target.result} title= ${theFile.name} />`
      ]; //.join('');
    };
  })(f);

  reader.readAsDataURL(f);
};
