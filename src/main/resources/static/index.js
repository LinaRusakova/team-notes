angular.module('app', []).controller('indexController', function ($scope, $http) {
    const contextPath = 'http://localhost:8180/team-notes/api/v1';


    $scope.acronym = function (sentence, size) {
        if(sentence != null) {
            console.log('acronym: ' + sentence + 'size: ' + size);
            let acro = sentence.split(' ').map(x => x[0]).join('').slice(0, size).toUpperCase();
            console.log(acro);
            return acro;
        }
        return '';
    }

    $scope.saveNote = function () {
        $scope.newNote.boardId = $scope.currentBoard.id;
        console.log($scope.newNote)
        $http.post(contextPath + '/note', $scope.newNote)
            .then(function (resp) {
                $scope.fillBoardWithNotes($scope.currentBoard);
                $scope.newNote = null;
                document.querySelector('#closeNoteButton').click();
            })

    }

    $scope.updateNote = function (note) {
        console.log($scope.currentBoard)
        note.boardId = $scope.currentBoard.id
        console.log(note)
        $http.put(contextPath + '/note', note)
            .then(function (resp) {
                $scope.fillBoardWithNotes($scope.currentBoard);
            })

    }
    $scope.deleteNote = function (id) {
        console.log('note id: ' + id)
        $http.delete(contextPath + '/note/' + id)
            .then(function (resp) {
                $scope.fillBoardWithNotes($scope.currentBoard);
            })

    };

    $scope.fillBoardWithNotes = function (currentBoard) {
        console.log('board id: ' + currentBoard.id)
        $scope.currentBoard = currentBoard;
        $http({
            url: contextPath + '/board/' + currentBoard.id + '/notes',
            method: 'GET'
        }).then(function (response) {
            $scope.Notes = response.data;
        });
    };

    $scope.getBoards = function () {
        console.log('get all boards function');
        $http({
            url: contextPath + '/board',
            method: 'GET'
        }).then(function (response) {
            $scope.Boards = response.data;
            console.log($scope.Boards);
        });
    }

    $scope.updateBoard = function () {
        $http.put(contextPath + '/board', this.board)
            .then(function (resp) {
                $scope.getBoards();
            })

    }

    $scope.saveBoard = function () {
        console.log($scope.newBoard)
        $http.post(contextPath + '/board', $scope.newBoard)
            .then(function (resp) {
                $scope.getBoards();
                $scope.newBoard.id = resp.data;
                console.log($scope.newBoard);
                $scope.currentBoard = $scope.newBoard;
                $scope.fillBoardWithNotes($scope.currentBoard);
                $scope.newBoard = null
                document.querySelector('#closeCreateBoardButton').click();
            })

    }

    $scope.deleteBoard = function (id) {
        console.log('board id: ' + id)
        $http.delete(contextPath + '/board/' + id)
            .then(function (resp) {
                $scope.getBoards();
            })

    };

    // $scope.isDataReady = function (dataForm, boardName){
    //     return !(dataForm.$pristine || dataForm.$invalid || !dataForm.name);
    //
    // }
    // $scope.invitedUser = $scope.user;
    // $scope.invitedUser.email = 'some@email.com';
    // $scope.updateUsers = function (){
        // console.log($scope.invitedUser)
        // $http.get(contextPath+'/user/' + $scope.invitedUser.email)
        //     .then(function (resp){
        //
        // });
    // }

    $scope.getBoards();


});