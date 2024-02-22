export function transformStatus(status) {
    if(status === 'SUBMITTED'){
        return 'UNDER REVIEW'
      }
    return status ? status.toUpperCase().split('_').join(' ') : "";
}




