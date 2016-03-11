/**
 * Created by AnkurR on 10/3/2016.
 */
$(function() {
    var notificationSystem = {
        intervalRef : 0,
        counterVal : 0,
        badgeElement : $('.badge.notification-counter'),
        dummyData : [
            { name : 'Erdo Klein',  text : ' posted photo on your wall',         image : 'public/images/avt_1.png'},
            { name : 'Alsad Kozar', text : ' commented on your photo',           image : 'public/images/avt_2.png'},
            { name : 'Tupac Sakur', text : ' posted 2 comments on your photo',   image : 'public/images/avt_3.png'}
        ],
        init : function() {
            this.counterVal = window.localStorage.getItem('notificationCount');
            this.setBadge(this.counterVal > 99 ? '99+' : this.counterVal);
            this.createNotifications(parseInt(window.localStorage.getItem('oldNotifications') || 0));
            this.startNotificationCounter(Math.floor(Math.random() * 10000));
            this.bindEvents();
        },
        startNotificationCounter : function(interval) {
            var that = this;
            this.intervalRef =  setTimeout(function() {
                var randomNum = Math.floor((Math.random() * 10)/2)+1;
                that.createNotifications(randomNum);
                that.counterVal = parseInt(that.counterVal || 0) + randomNum;
                window.localStorage.setItem('oldNotifications', parseInt(window.localStorage.getItem('oldNotifications') || 0) + randomNum);
                window.localStorage.setItem('notificationCount', that.counterVal);
                that.setBadge(that.counterVal);
                if(that.counterVal !== '99+' && parseInt(that.counterVal || 0) < 99) {
                    that.setBadge(that.counterVal);
                } else {
                    that.setBadge('99+');
                }
                that.startNotificationCounter(Math.floor(Math.random() * 10000))
            }, interval);
        },
        createNotifications : function(totalNotifications) {
            var newNotification = $('.dummy-notification-message').clone();
            for(var i=0;i<totalNotifications;i++) {
                var index = i%3;
                newNotification.removeClass('dummy-notification-message hidden');
                newNotification.find('.user-avatar').attr('src', this.dummyData[index].image);
                newNotification.find('.notification-msg').html(this.dummyData[index].text).prepend('<strong>'+ this.dummyData[index].name +'</strong>');
                $('.notification-list-container').prepend(newNotification);
                newNotification = $('.dummy-notification-message').clone();
                index++;
                if(index > 2) {
                    index = 0;
                }
            }
            $('.no-notification-message').addClass('hidden');
        },
        setBadge : function (value) {
            if(!$(".notification-list-wrapper").hasClass('opened')) {
                this.badgeElement.html(value);
            } else {
                this.badgeElement.html(0);
            }
        },
        bindEvents : function() {
            var that = this;
            $('.notification-btn').on('click', function(event) {
                $(".notification-list-wrapper").slideToggle();
                window.localStorage.setItem('notificationCount', 0);
                that.counterVal = 0;
                if($(".notification-list-wrapper").hasClass('opened')) {
                    $(".notification-list-wrapper").removeClass('opened');
                } else {
                    setTimeout(function() {
                        that.setBadge(0);
                    }, 400);
                    $(".notification-list-wrapper").addClass('opened');
                }
                event.stopPropagation();
            });
            $('body').on('click', function(event) {
                if($(".notification-list-wrapper").hasClass('opened') && $(event.target).parents('.notification-list-wrapper').length == 0) {
                    $(".notification-list-wrapper").slideToggle();
                    $(".notification-list-wrapper").removeClass('opened');
                    window.localStorage.setItem('notificationCount', 0);
                    that.counterVal = 0;
                }
                event.stopPropagation();
            });
        }
    };
    notificationSystem.init();
});