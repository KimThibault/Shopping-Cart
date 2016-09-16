

var selectedItem;
var selectedNumber;
var itemPrice;
var linePrice;
var sumTotal = 0;
var selectedItemAndPrice;
var itemArray = new Array; // type object
var numUniqueItemsInCart;
var totalNumItems;
var closeIcon = "<button class='btn_close' onclick='removeArticle(this)'><svg class='icon icon-cross'><use xlink:href='#icon-cross'></use></svg></button>";


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

        // build number of item list
        for (var i=1;i<5;i++){
        	var tblRow = "<option value='"+ i + "'>" + i + "</option>";
	   		$(tblRow).appendTo("select#select_number"); 	   		
		}

   });

});


function myChangeProduct(){
	var optionToGet = document.getElementById('select_product');
	selectedItem = optionToGet.options[optionToGet.selectedIndex].value; 
	itemPrice = document.getElementById('select_product').children[optionToGet.selectedIndex].dataset.price; 
 	selectedItemAndPrice = [selectedItem, itemPrice];

	return selectedItemAndPrice;
}

function myChangeNumber(){
	var optionToGet = document.getElementById('select_number');
	selectedNumber = optionToGet.options[optionToGet.selectedIndex].value; 

	return selectedNumber;
}


function addToCart(){ 
	var cartBody = document.getElementById('cart').getElementsByTagName('TBODY')[0];
	numUniqueItemsInCart = cartBody.getElementsByTagName('TR').length;

	selectedItem = selectedItemAndPrice[0];
	itemPrice = selectedItemAndPrice[1];
	linePrice = selectedNumber * itemPrice;
	sumTotal += linePrice;	

	// new selected item
	if (itemArray[selectedItem] == 0){   
		itemArray[selectedItem] += Number(selectedNumber);
		var cartRow = "<tr><td value='"+ selectedItem +"'>"+ selectedItem +"</td><td><input id='input-num-items'></input>"+ closeIcon +"</td><td>"+ itemPrice +"</td><td>"+ linePrice +"</td></tr>"; 		
		$(cartRow).appendTo("tbody");
 		cartBody.getElementsByTagName('TR')[numUniqueItemsInCart].getElementsByTagName('TD')[1].getElementsByTagName('INPUT')[0].value = itemArray[selectedItem];

		itemArray['TotalNumItems'] += selectedNumber;
		
	// item already selected	
	} else {  		
		itemArray[selectedItem] += Number(selectedNumber);	

 		var elemToSelect; 

 		// loop through cart to find line with item already selected
 		for (var i = 0; i<numUniqueItemsInCart;i++){
 			elemToSelect = cartBody.getElementsByTagName('TR')[i].getElementsByTagName('TD')[0].textContent;
 			if (elemToSelect == selectedItem){
 				cartBody.getElementsByTagName('TR')[i].getElementsByTagName('TD')[1].getElementsByTagName('INPUT')[0].value = itemArray[selectedItem];
 				cartBody.getElementsByTagName('TR')[i].getElementsByTagName('TD')[3].textContent = itemArray[selectedItem] * itemPrice;
 			}
 		} 				

 		itemArray['TotalNumItems'] += selectedNumber;		
	}

	checkIfCartIsEmpty();
	
	$("#td-total").html(sumTotal);	  
}


function updateCart() { 
	totalNumItems = 0;
	var numItemsOfThisTypeUpdated;
	var cartBody = document.getElementById('cart').getElementsByTagName('TBODY')[0];
	sumTotal = 0;
	var k = 0;
	var idxToDelete = new Array;

	for (var i = 1; i<numUniqueItemsInCart;i++){
		elemToSelect = cartBody.getElementsByTagName('TR')[i].getElementsByTagName('TD')[0].textContent;
		numItemsOfThisTypeUpdated = cartBody.getElementsByTagName('TR')[i].getElementsByTagName('TD')[1].getElementsByTagName('INPUT')[0].value;
		totalNumItems += numItemsOfThisTypeUpdated;

		itemPrice = cartBody.getElementsByTagName('TR')[i].getElementsByTagName('TD')[2].textContent;
		linePrice = numItemsOfThisTypeUpdated * itemPrice;
		cartBody.getElementsByTagName('TR')[i].getElementsByTagName('TD')[3].textContent = linePrice;
		sumTotal += linePrice;	

		if (numItemsOfThisTypeUpdated == 0){
			idxToDelete[k] = i;
			k++;
		}
	}
	itemArray['TotalNumItems'] = totalNumItems;
	$("#td-total").html(sumTotal);	

	for (k = idxToDelete.length-1; k>=0; k--){
		i = idxToDelete[k];
		cartBody.removeChild(cartBody.getElementsByTagName('TR')[i]);
	}	

	checkIfCartIsEmpty();
}

function removeArticle(inputThis) {
	row = inputThis.closest("tr"); 
	
	var elemToSelect          = row.getElementsByTagName('TD')[0].textContent;
	numItemsOfThisTypeDeleted = row.getElementsByTagName('TD')[1].getElementsByTagName('INPUT')[0].value;
	itemPrice                 = row.getElementsByTagName('TD')[2].textContent;
	linePrice = numItemsOfThisTypeDeleted * itemPrice;
	sumTotal -= linePrice;

	$("#td-total").html(sumTotal);	

	totalNumItems -= numItemsOfThisTypeDeleted;
	itemArray['TotalNumItems'] = totalNumItems;
	itemArray[selectedItem] = 0;

	row.parentNode.removeChild(row);

	checkIfCartIsEmpty();
}

function checkIfCartIsEmpty() {
// display of 'Your cart is empty'	
	emptyCartLine = document.getElementById('cart').getElementsByTagName('TBODY')[0].getElementsByTagName('TR')[0];
	if (itemArray['TotalNumItems'] == 0){   
		$(emptyCartLine).css("display","inline");		
	} else {
		$(emptyCartLine).css("display","none");
	}
}