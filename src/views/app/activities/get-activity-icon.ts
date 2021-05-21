export default function getActivityIcon (activity) {
    switch (activity.type) {
        case "create":
            return 'check'
        case "info":
            return 'gray'
        case "delete":
            return 'close'
        case "update":
            return 'update'
    }
    return 'white'
}