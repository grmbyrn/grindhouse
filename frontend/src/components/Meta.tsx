const Meta = ({
    title = 'Grind House | Coffee gear and fresh beans',
    description = 'Grinders, brewers and freshly roasted coffee, delivered.',
    keywords = 'coffee, coffee grinder, pour-over, french press, coffee beans',
}) => {
    return (
        <>
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
        </>
    )
}

export default Meta
