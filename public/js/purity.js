
        // IDs
        // toHide: Everything that needs to be hidden when score is shown
        // toShow: Everything that needs to be shown when score is shown
        // score: h1 that shows the score
        
        // Initially hides results
        $("#toShow").hide();

        // Pre-calcuate the individual send order
        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
        const order = shuffle(nums);

        // On click of the submit button: 
        $('#submit').click(function() {
            // Calculates purity
            var sinList = document.querySelectorAll('input[type="checkbox"]:checked');
            var sins = sinList.length;
            var purity = 100-sins;
            
             
                
            

            // Shows the score in the h1
            $('#score').html(purity);
            
            // Shows the score and hides the checks
            $("#toShow").show();
            $("#toHide").hide();
        });
        
        // On click of the reset button: 
        $('#reset').click(function() {
            $('input:checkbox').removeAttr('checked');
            $('input:checkbox').prop('checked', false);

        });
        