function ready(cb) {
    /in/.test(document.readyState)
    ? setTimeout(ready.bind(null, cb), 90)
    : cb();
};

ready(function(){

    var App = {
        "init": function() {
            this._applicationDbContext = ApplicationDbContext; // Reference to the ApplicationDbContext object
            this._applicationDbContext.init('ahs.nmd.stickynotes'); // Intialize the ApplicationDbContext with the connection string as parameter value
            this.testApplicationDbContext(); // Test DbContext
        },
        "testApplicationDbContext": function() {
            
            // Get StickyNotes
            let stickyNotes = this._applicationDbContext.getStickyNotes();
            let stickyEl = document.querySelector('.stickynote')

            if (stickyNotes == null) {
                stickyEl.innerHTML = "Er zijn nog geen sticky notes!";
            }
            else {
                console.log(stickyNotes);

                stickyNotes.forEach(function(el, i){
                    console.log(el);
                    
                    stickyEl.innerHTML += 
                    `
                    <div class="card p-3">
                        <div class="card-block">
                            
                            <p class="card-text"><small class="text-muted">Created ${el.createdDate}</small></p>
                            ${!(el.modifiedDate == null) ? `<p class="card-text"><small class="text-muted">Modified ${el.modifiedDate}</small></p>` 
                            : ``}
                            ${!(el.deletedDate == null) ? `<p class="card-text"><small class="text-muted">Modified ${el.deletedDate}</small></p>` 
                            : ``}
                            <h4 class="card-title">Sticky Note ${i + 1}</h4>
                            <p class="card-text">${el.message}</p>
                            <form>
                                <button class="btn btn-primary blue updateStickyNote" id="${el.id}">Update</button>
                                ${el.deletedDate == null ? `<button class="btn btn-danger softdelete" id="${el.id}">Soft Delete</button>`
                                : `<button class="btn btn-danger softUndelete" id="${el.id}">Soft Undelete</button>`}
                                <button class="btn btn-danger delete">
                                    <i class="fa fa-trash" aria-hidden="true"></i>                            
                                </button>
                            </form>
                        </div>
                    </div>
                    `;
                }, this);
            }
            
            // Declare btn classes
            let deleteStickyNote = document.querySelectorAll('.delete');
            let softDeleteStickyNote = document.querySelectorAll('.softdelete');
            let softUnDeleteStickyNote = document.querySelectorAll('.softUndelete');
            let updateStickyNote = document.querySelectorAll('.updateStickyNote');

            // Add StickyNotes
            document.getElementById('makeStickyNote').addEventListener('click', makeStickyNote);
            document.addEventListener('keydown', function(e) {
                if(e.keyCode == 13){
                    makeStickyNote();
                }
            })

            // Make Sticky Notes function
            function makeStickyNote() {
                let value = document.getElementById('stickyNoteValue').value;
                if (value == null || value == "") {
                    alert("Please enter a message");
                } else {
                    let newStickyNote = new StickyNote();
                    newStickyNote.message = value;
                    ApplicationDbContext.addStickyNote(newStickyNote);
                }
            }
            
            // Delete StickyNotes 
            // Deleted werkt niet, retourneert telkens false          
            for(var i = 0; i < deleteStickyNote.length; i++) {
                deleteStickyNote[i].addEventListener('click', function(e) {
                    if(confirm('Are you sure you want to delete this sticky note? It will be gone forever')) {
                        let id = parseInt(this.id);
                        ApplicationDbContext.deleteStickyNoteById(id);
                        doucment.getElementById(id).style.display = 'none';
                    } 
                    else {
                        e.preventDefault();
                    }
                });
            }

            // SoftDelete Sticky Notes
            for(var i = 0; i < softDeleteStickyNote.length; i++) {
                softDeleteStickyNote[i].addEventListener('click', function() {
                    let id = parseInt(this.id);
                    let deleted = ApplicationDbContext.softDeleteStickyNoteById(id);
                });
            }

            // SoftUnDelete Sticky Notes 
            for(var i = 0; i < softUnDeleteStickyNote.length; i++) {
                softUnDeleteStickyNote[i].addEventListener('click', function() {
                    let id = parseInt(this.id);
                    let deleted = ApplicationDbContext.softUnDeleteStickyNoteById(id);
                });
            }

            // Update Sticky Notes
            for(var i = 0; i < updateStickyNote.length; i++) {
                updateStickyNote[i].addEventListener('click', function(e){
                    let message = prompt("Please enter a new message");
                    if (message == null || message == "") {
                        alert("Please enter a message");
                    } else {
                        let id = parseInt(this.id);
                        newStickyNote = ApplicationDbContext.getStickyNoteById(id);
                        newStickyNote.message = message;
                        let updated = ApplicationDbContext.updateStickyNote(newStickyNote);
                    }
                });
            }
            
        
            

            /*1. Get all sticky notes
            let data = this._applicationDbContext.getStickyNotes();
            console.log(data);
            // 2. Create a new sticky note
            let sn = new StickyNote();
            sn.message = 'Pak cola zero voor mezelf.';
            sn = this._applicationDbContext.addStickyNote(sn); // add to db and save it
            // 3. Get allesticky notes
            data = this._applicationDbContext.getStickyNotes();
            console.log(data);
            // 4. Get sticky note by id
            sn = this._applicationDbContext.getStickyNoteById(2954840256566);
            console.log(sn);
            // 5. Delete sticky note by id
            const deleted = this._applicationDbContext.deleteStickyNoteById(2954840256566);
            console.log(deleted);
            // 6. Soft Delete sticky note with id: 2935967665756
            //const softDeleted = this._applicationDbContext.softDeleteStickyNoteById(2935967665756);
            //console.log(softDeleted);
            //sn = this._applicationDbContext.getStickyNoteById(2935967665756);
            //console.log(sn);
            // 6. Soft Delete sticky note with id: 2935967665756
            const softUnDeleted = this._applicationDbContext.softUnDeleteStickyNoteById(2935967665756);
            console.log(softUnDeleted);
            sn = this._applicationDbContext.getStickyNoteById(2935967665756);
            console.log(sn);
            // Update sticky note with id: 1902577181167
            sn = this._applicationDbContext.getStickyNoteById(2396844908904);
            console.log(sn);
            sn.message = 'ik heb zin in een zwarte kat (koffie)...';
            const updated = this._applicationDbContext.updateStickyNote(2396844908904);
            console.log(updated);
            sn = this._applicationDbContext.getStickyNoteById(2396844908904);
            console.log(sn);*/
        }
    };

    App.init(); // Initialize the application
});