// Rewrite of model.refList to better accomodate common usage where one wants to simply convert an object full of objects to a loopable list (array)
get( '*', function( page, model, params, next ) {
		
    // Check to see if rewrite of refList already has been loaded
    if( !model.oldRefList ) {
      
      // counter id used to keep temporary lists of ids separate
      var 
        i = 1;
      
      // Save the old version of refList for internal usage here and in case one would still want to use it later
      model.oldRefList = model.refList;
      
      // The same parameters as the normal refList, except new_path and ref_path is optional
      // NOTICE though that new_path is only(!) optional in case ref_path is omitted, and also new_path (but only if ref_path is omitted)
      // If ref_path isn't sent in as a parameter, create a list based on path that consists of all the ids of that path (hence, everything from that path will be returned but in list form)
      model.refList = function ( new_path, path, ref_path ) {
          
          var
            ref_path = ref_path || '_temp_list_' + i, 
            path = path || new_path;
          
          // new_path was omitted, then use path as base and simply prefix it with _
          if( path === new_path ) {
            
            new_path = '_' + path;
            
          }
          
          // If ref_path was omitted, create a temporary list containing all _ids of the path
          if( ref_path === '_temp_list_' + i ) {
            
            var
              the_models = model.get( path ),
              id_name = ( typeof _.find(
                  the_models,
                  function () {
                    
                    return true;
                    
                  }
                )._id === 'undefined' ? 'id' : '_id' );
            
            model.set( 
                '_temp_list_' + i, 
                _.pluck( 
                    the_models,
                    id_name
                  )
              );
            
            // Add to counter to avoid collision with next temp list
            i++;
            
          }
          
          // Use old refList with new parameters
          return model.oldRefList( new_path, path, ref_path );
          
        };
        
      }
    
		next();
		
	});