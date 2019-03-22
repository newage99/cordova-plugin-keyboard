/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    channel = require('cordova/channel'),
    exec = require('cordova/exec');

var Keyboard = function() {};

Keyboard.shrinkView = function(shrink, success) {
    if (shrink !== null && shrink !== undefined) {
        exec(success, null, "Keyboard", "shrinkView", [shrink]);
    } else {
        exec(success, null, "Keyboard", "shrinkView", []);
    }
};

Keyboard.hideFormAccessoryBar = function(hide, success) {
    if (hide !== null && hide !== undefined){
        exec(success, null, "Keyboard", "hideFormAccessoryBar", [hide]);
    } else {
        exec(success, null, "Keyboard", "hideFormAccessoryBar", []);
    }
};

Keyboard.disableScrollingInShrinkView = function(disable, success) {
    if (disable !== null && disable !== undefined) {
        exec(success, null, "Keyboard", "disableScrollingInShrinkView", [disable]);
    } else {
        exec(success, null, "Keyboard", "disableScrollingInShrinkView", []);
    }
};

Keyboard.fireOnShow = function(height) {
    Keyboard.isVisible = true;
    cordova.fireWindowEvent('keyboardDidShow', {
        'keyboardHeight': height
    });
};

Keyboard.fireOnHide = function() {
    Keyboard.isVisible = false;
    cordova.fireWindowEvent('keyboardDidHide');
};

Keyboard.fireOnShowing = function(height) {
    cordova.fireWindowEvent('keyboardWillShow', {
        'keyboardHeight': height
    });
};

Keyboard.fireOnHiding = function() {
    // Automatic scroll to the top of the page
    // to prevent quirks when using position:fixed elements
    // inside WebKit browsers (iOS specifically).
    // See CB-6444 for context.
    if (Keyboard.automaticScrollToTopOnHiding) {
        document.body.scrollLeft = 0;
    }
    cordova.fireWindowEvent('keyboardWillHide');
};

Keyboard.show = function() {
    exec(null, null, "Keyboard", "show", []);
};

Keyboard.hide = function() {
    exec(null, null, "Keyboard", "hide", []);
};

channel.onCordovaReady.subscribe(function () {
    exec(success, null, 'Keyboard', 'init', []);

    function success(msg) {
        var action = msg.charAt(0);
        if (action === 'S') {
            var keyboardHeight = parseInt(msg.substr(1));
            Keyboard.fireOnShowing(keyboardHeight);
            Keyboard.fireOnShow(keyboardHeight);

        } else if (action === 'H') {
            Keyboard.fireOnHiding();
            Keyboard.fireOnHide();
        }
    }
});

Keyboard.isVisible = false;
Keyboard.automaticScrollToTopOnHiding = false;

module.exports = Keyboard;
