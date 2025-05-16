
; /* Start:"a:4:{s:4:"full";s:98:"/bitrix/templates/.default/components/mibok/special_link/round_custome_btn/script.js?1683098074175";s:6:"source";s:84:"/bitrix/templates/.default/components/mibok/special_link/round_custome_btn/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
document.addEventListener("DOMContentLoaded", () => {
    const link = document.querySelector('.mibok-link .wrapper-mibok-glaza-link');
    if (link) 
        link.focus()
});
/* End */
;
; /* Start:"a:4:{s:4:"full";s:87:"/bitrix/templates/museum/components/bitrix/menu/left_navigation/script.js?1556831461507";s:6:"source";s:73:"/bitrix/templates/museum/components/bitrix/menu/left_navigation/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
var jsvhover = function()
{
	var menuDiv = document.getElementById("vertical-multilevel-menu");
	if (!menuDiv)
		return;

  var nodes = menuDiv.getElementsByTagName("li");
  for (var i=0; i<nodes.length; i++) 
  {
    nodes[i].onmouseover = function()
    {
      this.className += " jsvhover";
    }
    
    nodes[i].onmouseout = function()
    {
      this.className = this.className.replace(new RegExp(" jsvhover\\b"), "");
    }
  }
}

if (window.attachEvent) 
	window.attachEvent("onload", jsvhover); 
/* End */
;; /* /bitrix/templates/.default/components/mibok/special_link/round_custome_btn/script.js?1683098074175*/
; /* /bitrix/templates/museum/components/bitrix/menu/left_navigation/script.js?1556831461507*/
