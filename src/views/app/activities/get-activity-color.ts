export default function getActivityColor (activity) {
    switch (activity.type) {
        case "create":
            return 'green'
        case "info":
            return 'gray'
        case "delete":
            return 'red'
        case "update":
            return 'blue'
    }
    return 'white'
}