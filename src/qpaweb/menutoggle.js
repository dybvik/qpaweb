function menuToggle(elementToHide, iconToChange) {
  if (document.getElementById(elementToHide)) {
      if (document.getElementById(elementToHide).style.display=='block' ||
          document.getElementById(elementToHide).style.display=='')  {
          document.getElementById(elementToHide).style.display = 'none';
          document.getElementById(iconToChange).className = 'iconExpand';
      } else {
          document.getElementById(elementToHide).style.display = 'block';
          document.getElementById(iconToChange).className = 'iconCollapse';
      }
  }
}