

var selectedItem, selectedNumber, selectedItemAndPrice; 
var cartBody;         
var sumTotalInCart = 0;   
var numUniqueItemsInCart = 0;  
var itemArray = [];         
var closeIconButton = "<button class='btn_close' onclick='removeArticle(this)'><i class='fa fa-times' id='x-close'></i></button>";
//var cartBody        = document.getElementById('cart').getElementsByTagName('TBODY')[0];
//var emptyCartLine   = cartBody.getElementsByTagName('TR')[0];
//var cartLine = cartBody.getElementsByTagName('TR')[i]; // i=1,2,3...
//var numItemsSlot = cartLine.getElementsByTagName('TD')[1];
//var numItemsAsInput = Number(numItemsSlot.getElementsByTagName('input')["input-num-items"].value);



$(function() {
   var inventary = [];
   var el;

   $.getJSON('inventary.json', function(data) {
   		// build item list and item array
        $.each(data.product, function(i, f) {       		       	  
	        var tblRow = "<option value='"+ f.item + "'>" + f.item + "</option>";
	        $(tblRow).appendTo("select#select_product");
	               	  
       	  	el = document.getElementById('select_product').children[i+1];	       	 
	      	el.setAttribute("data-price", f.price);

	      	itemArray[f.item] = 0;
    	});
    	itemArray['TotalNumItems'] = 0;

        // build list of item qty
        for (var i=1;i<5;i++){
        	var tblRow = "<option value='"+ i + "'>" + i + "</option>";
	   		$(tblRow).appendTo("select#select_number"); 	   		
		}
   });
});



function myChangeProduct(){
	var optionToGet = document.getElementById('select_product');
	selectedItem    = optionToGet.options[optionToGet.selectedIndex].value; 
	var itemPrice   = document.getElementById('select_product').children[optionToGet.selectedIndex].dataset.price; 
 	selectedItemAndPrice = [selectedItem, itemPrice];
	return selectedItemAndPrice;
}

function myChangeNumber(){
	var optionToGet = document.getElementById('select_number');
	selectedNumber  = optionToGet.options[optionToGet.selectedIndex].value; 
	return selectedNumber;
}


function addToCart(){ 
	var cartLine = numItemsSlot = linePriceSlot = '';
	var numItemsAsInput = 0;
	var elemToSelect = '';
	cartBody   = document.getElementById('cart').getElementsByTagName('TBODY')[0];

	numUniqueItemsInCart = cartBody.getElementsByTagName('TR').length;

	selectedItem   = selectedItemAndPrice[0];
	var itemPrice  = selectedItemAndPrice[1];
	var linePrice  = selectedNumber * itemPrice;
	sumTotalInCart += linePrice;	

	$("#td-total").html(sumTotalInCart);	


	// new selected item
	if (itemArray[selectedItem] === 0){   
		// modify html
		itemArray[selectedItem] += Number(selectedNumber);
		var cartRow = "<tr><td value='"+ selectedItem +"'>"+ selectedItem +"</td><td><input id='input-num-items'></input>"+ closeIconButton +"</td><td>"+ itemPrice +"</td><td>"+ linePrice +"</td></tr>"; 		
		$(cartRow).appendTo("tbody");
 		cartBody.getElementsByTagName('TR')[numUniqueItemsInCart].getElementsByTagName('TD')[1].getElementsByTagName('INPUT')[0].value = itemArray[selectedItem];
 				
	// item already selected	
	} else {  		
		// modify data at line of item
		itemArray[selectedItem] += Number(selectedNumber);	

		// modify html
 		// loop through cart to find line with item already selected:
 		for (var i = 0; i<numUniqueItemsInCart;i++){
			cartLine        = cartBody.getElementsByTagName('TR')[i]; 
            numItemsSlot    = cartLine.getElementsByTagName('TD')[1];
 			elemToSelect    = cartLine.getElementsByTagName('TD')[0].textContent;
 			linePriceSlot   = cartLine.getElementsByTagName('TD')[3];
 			if (elemToSelect == selectedItem){ 				
 				numItemsSlot.getElementsByTagName('INPUT')[0].value = itemArray[selectedItem];
 				linePriceSlot.textContent = itemArray[selectedItem] * itemPrice;
 			}
 		} 				
	}

	// modify data 
	itemArray['TotalNumItems'] += Number(selectedNumber);

	checkIfCartIsEmpty();	
}

function updateCart() { 
	var totalNumItems = 0; 
	var localSumTotalInCart = 0; 
	var numItemsAsInput = 0;
	var itemPrice, linePrice;
	var numItemsSlot;
	var k = 0;
	var idxToDelete = new Array;
	var cartLine;

	cartBody = document.getElementById('cart').getElementsByTagName('TBODY')[0];
	numUniqueItemsInCart = cartBody.getElementsByTagName('TR').length - 1;

	if (itemArray['TotalNumItems'] !== 0){
		for (var i = 1; i <= numUniqueItemsInCart;i++){
			cartLine     = cartBody.getElementsByTagName('TR')[i];
			numItemsSlot = cartLine.getElementsByTagName('TD')[1];
			
		    numItemsAsInput = Number(numItemsSlot.getElementsByTagName('input')["input-num-items"].value);
			totalNumItems   += numItemsAsInput; 

			itemPrice = cartLine.getElementsByTagName('TD')[2].textContent;
			linePrice = numItemsAsInput * itemPrice;
			cartBody.getElementsByTagName('TR')[i].getElementsByTagName('TD')[3].textContent = linePrice; // set line price
			localSumTotalInCart += linePrice;	

			if (numItemsAsInput === 0){
				idxToDelete[k] = i;
				k++;
			}
		}
	}

	itemArray['TotalNumItems'] = totalNumItems;
	$("#td-total").html(localSumTotalInCart);	

	for (k = idxToDelete.length-1; k>=0; k--){
		i = idxToDelete[k];
		cartBody.removeChild(cartBody.getElementsByTagName('TR')[i]);
		//numUniqueItemsInCart -= 1;
	}	

	checkIfCartIsEmpty();
}

function removeArticle(inputThis) {
	var itemPrice,linePrice,totalNumItems;
    var numItemsOfThisTypeDeleted = 0;

	//numUniqueItemsInCart -= 1;

    // modify html
	row = inputThis.closest("tr"); 
	numItemsOfThisTypeDeleted = Number(row.getElementsByTagName('TD')[1].getElementsByTagName('INPUT')[0].value);
	itemPrice                 = Number(row.getElementsByTagName('TD')[2].textContent);
	linePrice                 = numItemsOfThisTypeDeleted * itemPrice;
	sumTotalInCart            -= linePrice;
	$("#td-total").html(sumTotalInCart);	

    // modify data
	itemArray['TotalNumItems'] -= numItemsOfThisTypeDeleted;
	itemArray[row.getElementsByTagName('TD')[0].textContent] = 0;

	// when all is done, remove line
	row.parentNode.removeChild(row);

	checkIfCartIsEmpty();
}

function checkIfCartIsEmpty() { // display of 'Your cart is empty'	
	var emptyCartLine = document.getElementById('cart').getElementsByTagName('TBODY')[0].getElementsByTagName('TR')[0];
	if (itemArray['TotalNumItems'] > 0){   
		$(emptyCartLine).css("display","none");
		$('tfoot').css("display","table-footer-group");
	} else {
		$(emptyCartLine).css("display","table-row");
		$('tfoot').css("display","none");
	}	
}