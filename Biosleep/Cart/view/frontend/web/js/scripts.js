require([
    'jquery',
    'Magento_Checkout/js/sidebar',
    'Magento_Ui/js/modal/confirm',
    'Magento_Customer/js/customer-data'
], function ($, sidebar, confirm, customerData) { 
    'use strict';
    
    let miniCart = $('[data-block=\'minicart\']');
    let drawer_div = jQuery("#drawer");
    let minicart_backdrop = jQuery(".cart-backdrop");

    $(document).ready(function(){

        $(document).on("click", ".open-drawer-link", function(e){
            e.preventDefault();                      
            
            if ( drawer_div.hasClass("showing") ) {
                hideSidebar();
            } else {
                showSidebar();
            }
        });

        $(document).on("click", ".close-drawer", function(e){
            e.preventDefault();

            hideSidebar();
        });

        $(document).on("click", ".cart-backdrop", function(){
            $(".close-drawer").trigger("click");
        });

        $(document).on("click", ".cart-item-remove", function() {
            var itemId = $(this).data('cart-item'); 

            confirm({
                content: "Are you sure you would like to remove this item from the shopping cart?",
                actions: {                    
                    confirm: function () {
                        $("body").trigger('processStart');

                        sidebar._proto._ajax(window.checkout.removeItemUrl, {
                            'form_key': $.mage.cookies.get('form_key'),
                            'item_id': itemId
                        }, $(this), function(item){
                            let productSku = item.data("sku"); console.log("sku: ", productSku);
                            console.log(item);  
                            console.log(customerData.get('cart')());    
                            $(document).trigger('ajax:removeFromCart', productSku);        
                            $("body").trigger('processStop');                                                                   
                        });
                    },
                    
                    always: function (e) {
                        e.stopImmediatePropagation();
                    }
                }
            });            

        });

        $(document).on("click", ".ctrl__button--decrement", function() {
            let cartItemId = $(this).data("decrement");
            let qtyBox = $(`#cart-item-${cartItemId}-qtybox`);
            let currentQty = parseInt( qtyBox.val() );
            let decreasedQty = ( currentQty - 1 === 0 ) ? 1 : ( currentQty - 1 );
            qtyBox.val( decreasedQty );

            $("body").trigger('processStart');

            sidebar._proto._ajax(window.checkout.updateItemQtyUrl, {
                'item_id': cartItemId,
                'item_qty': decreasedQty
            }, qtyBox, function() {
                $("body").trigger('processStop');
            });            
            
            //console.log(qtyBox, currentQty, decreasedQty);
            
        });

        $(document).on("click", ".ctrl__button--increment", function() {
            let cartItemId = $(this).data("increment");
            let qtyBox = $(`#cart-item-${cartItemId}-qtybox`);
            let currentQty = parseInt( qtyBox.val() );
            let increasedQty = currentQty + 1;
            qtyBox.val( increasedQty );

            $("body").trigger('processStart');

            sidebar._proto._ajax(window.checkout.updateItemQtyUrl, {
                'item_id': cartItemId,
                'item_qty': increasedQty
            }, qtyBox, function() {
                $("body").trigger('processStop');
            });              

            //console.log(qtyBox, currentQty, increasedQty);
            
        });        

    });

    miniCart.on('contentUpdated', function () {
        if ( ! drawer_div.hasClass("showing") ) {
            showSidebar();
        }                                           
    });  
    
    function showSidebar() {
        drawer_div.animate({
            "margin-right": 0
        }, "slow")
        .addClass("showing");
        minicart_backdrop.addClass("showing");
        $("body").css("overflow", "hidden");
    }

    function hideSidebar() {
        drawer_div.animate({
            "margin-right": `-450`
        }, "slow")
        .removeClass("showing");
        minicart_backdrop.removeClass("showing");
        $("body").css("overflow", "auto");
    }  

});