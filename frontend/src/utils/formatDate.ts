// Dates come from the API as ISO strings, e.g. 2026-10-31T14:16:54.202Z.
// These show them in the visitor's own locale and time zone.

// e.g. 31 Oct 2026
export const formatDate = (date?: string) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

// e.g. 31 Oct 2026, 14:16
export const formatDateTime = (date?: string) => {
    if (!date) return ''
    return new Date(date).toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}
