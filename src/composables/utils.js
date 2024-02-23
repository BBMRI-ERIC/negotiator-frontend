export function transformStatus(status) {
    if(status === 'SUBMITTED'){
        return 'UNDER REVIEW'
      }
    return status ? status.toUpperCase().split('_').join(' ') : "";
}


export function getBadgeColor(status) {
    if(status === 'SUBMITTED'){
        return 'bg-status-badge'
    } else {
        return 'bg-success'
    }
}

export function getBadgeIcon(status) {
    if(status === 'SUBMITTED'){
        return 'bi-search'
    } else {
        return 'bi bi-chat-left-dots'
    }
}


