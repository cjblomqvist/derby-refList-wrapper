// Rewrite of model.refList to better accomodate common usage where one wants to simply convert an object full of objects to a loopable list (array)
get('*', function( page, model, params, next ) {
		
		// Save the old version of refList for internal usage here and in case one would still want to use it later
		model.oldRefList = model.refList;
		
		// The same parameters as the normal refList, except new_path and ref_path is optional
		// NOTICE though that new_path is only(!) optional in case ref_path is omitted, and also new_path (but only if ref_path is omitted)
		// If ref_path isn't sent in as a parameter, create a list based on path that consists of all the ids of that path (hence, everything from that path will be returned but in list form)
		model.refList = function ( new_path, path, ref_path ) {
				
				var
					ref_path = ref_path || '_make_list_temp'
					path = path || new_path;
				
				// new_path was omitted, then use path as base and simply prefix it with _
				if( path === new_path ) {
					
					new_path = '_' + path;
					
				}
				
				// If ref_path was omitted, create a temporary list containing all ids of the path
				if( ref_path === '_make_list_temp' ) {
					
					model.set( 
							'_make_list_temp', 
							_.map( 
								model.get( path ), 
								function ( value, key, list ) { 
									
									return key; 
									
								}
							) 
						);
					
				}
				
				// Use old refList with new parameters
				return model.oldRefList( new_path, path, ref_path );
				
			};
		
		next();
		
	});