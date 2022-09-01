const coursesData = require('./courseData');
const createTopic = require('./createTopic');
const processProducer = require('./producer');

var getCourse = function(args) { 
    var id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}
var getCourses = function(args) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}
var updateCourseTopic = function({id, topic}) {
    // map the courses
    coursesData.map(course => {
        if (course.id === id) {
            // update the coarse topic
            course.topic = topic;
            return course;
        }
    });

    // grab the changed coarse
    const updatedCoarse = coursesData.filter(course => course.id === id) [0];
    const message = {coarseId: updatedCoarse};
    const topicName = "courseUpdate";

    processProducer({topicName, message}).then(() => {
        console.log('producer sent message successfully');
    }).catch((err) => {
        console.log('error in producer', err);
    });
    
    return coursesData.filter(course => course.id === id) [0];
}
var createNewTopic = function(args) {
        // create new topic using kafka
        createTopic(args.topicName).then((res) => {
            console.log(`${args.topicName} topic created: `, res);
            return {success: true};
        }).catch((err) => {
            console.log(err, 'err');
            return {success: false};
        });
}

var coarseUpdated = function({coarse}) {
    return coarse;
}

exports.exports = {
    getCourse,
    getCourses,
    updateCourseTopic,
    createNewTopic,
    coarseUpdated,
}