//Check to see if the item is an unpurchased print item.
$(document).ready(function() {

  if ($('a:contains("YBP_DDA_Unpurchased_Print")').length) {

// If it is, add the request link.

    var requesttext = '&nbsp;&nbsp;Click here to request that the Library purchase this book <br />&nbsp;&nbsp;(UCSC students, faculty and staff only). Books arrive usually in 7-10 days.<br /><br />';
    var requesthref = $('a#recordnum').attr('href');
    var requesturl = 'https://cruzcat-ucsc-edu.oca.ucsc.edu' +  requesthref +  '?dda-request=yes';
    var requestlink = '<a id="dda-request" style="font-size:16px;" href="' + requesturl + '"target="blank">' + requesttext + '</a>';
    $(requestlink).insertAfter('h1.bibDisplayTitle:first');
  }  
});

//////////////////////////////////////////////////////////////////
//Get current URL.
$(document).ready(function() {
	
  var pageUrl = $(location).attr('href');

//If it is the acquire page, insert hold checkboxes, populate the form fields, and validate barcode.

  if(pageUrl == 'https://cruzcat-ucsc-edu.oca.ucsc.edu/acquire') {

//////////////////////////////////////////////////////////////////
// Insert hold checkboxes
	  
    var holdCheckboxes = $('<fieldset><div class="formEntryArea" id="hold"><label for="hold"><legend>Hold Preference:</label></legend><input type=radio checked name=hold value="">Do not hold, I\'m only recommending the book for purchase.<input type=radio name=hold value="hold: YES">Please hold the book at the circulation desk for me when it arrives.</div></fieldset>');
    $(holdCheckboxes).insertAfter('div#accessibleForm fieldset:first');

//COMMENTING OUT EBOOK OPTION TEMPORARILY PER SCOTTK 1/9/2014 TRB
//////////////////////////////////////////////////////////////////
// Insert ebook checkboxes
/*	  
    var ebookCheckboxes = $('<fieldset><div class="formEntryArea" id="ebook"><label for="ebook"><legend>Ebook Option: if the book is available as an ebook, please purchase the ebook</label></legend><input type=radio checked name=ebook value="prefer ebook: YES">Yes<input type=radio name=ebook value="prefer PRINT">NO</div></fieldset>');
   $(ebookCheckboxes).insertAfter('div#accessibleForm fieldset:first');	
*/
  
//////////////////////////////////////////////////////////////////
//Get values from cookie and populate form fields.

    //var cookievalue = $.cookie('ccrequest').split('/record=');
    var cookievalue = $.cookie('ccrequest').split(/(?:\/record=|bib_ISBN=)+/);
    var itemtitle = cookievalue[0];
    var bibnum = cookievalue[1] + 'a';
    var isbn = cookievalue[2];
    $('input#title').val(itemtitle);
    // "publish" is a hidden field
    $('input#publish').val('bib: ' + bibnum + '\t' + 'isbn: ' + isbn);
    $.removeCookie('ccrequest', { path: '/' });

//////////////////////////////////////////////////////////////////	
//Check to make sure value of barcode field is 14 digits long and only numbers. Add hold, ebook and bibnumber values to form fields.

//#other  Max Characters = 40; Prompt = ""
//#mention Max Characters = 100; Prompt = "Other Information" 


    $('#accessibleForm form').submit(function() {
      var barcode = $('input#barcode').val().replace(/[^0-9]/g,'').length;
      var holdValue = $('#hold input:checked').val() 
      //var ebookValue = $('#ebook input:checked').val()
      if (barcode == '14') {		  
        $('input#other').val(holdValue);
        //$('input#other').val(ebookValue + '\t ' +holdValue);
      return true;
    }
      alert ('Please enter a valid barcode.');
      return false;
    });
  } 

//////////////////////////////////////////////////////////////////
//Else if it is a record page arrived at by clicking the DDA request link.

  else if (window.location.search == '?dda-request=yes') {

//////////////////////////////////////////////////////////////////
 //Create cookie from title, ISBN and bib number of record.

    $.removeCookie('ccrequest', { path: '/' });
    milHarvest();
    var isbn = 'bib_ISBN=' + bib_ISBN;	
    var itemtitle = ($('td.bibInfoData strong:first').text().replace('<font color="RED">', '').replace('</strong></font>', ''));
    var bibnum = ($('#recordnum').attr('href').slice(0,-3));
    var cookievalue = itemtitle + bibnum + isbn
    $.cookie('ccrequest', cookievalue, { expires: 1, path: '/' });

//////////////////////////////////////////////////////////////////
// Redirect to acquire page.

    var acquireurl = 'https://cruzcat-ucsc-edu.oca.ucsc.edu/acquire';
    window.location.replace(acquireurl);
  }
});