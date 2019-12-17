import React from 'react'
import PropTypes from 'prop-types'
import ReactGA from 'react-ga'
import { Link } from 'gatsby'
import resources from 'data/recommended_resources.yml'
import BlockTitle from 'core/blocks/block/BlockTitle'
import { useI18n } from 'core/i18n/i18nContext'
import get from 'lodash/get'

const trackClick = (id, resource, label) => {
    ReactGA.event({
        category: 'Sponsor Clicks',
        action: `${id}: ${resource.name}`,
        label
    })
}

const RecommendedResourcesBlock = ({ block, data }) => {
    const { translate } = useI18n()

    const sponsors = get(block, 'variables.sponsors')

    if (!sponsors) {
        return null
    }

    // although sponsors should always be an array, seems like it can be a string for some reason
    const sponsorsIds = Array.isArray(sponsors) ? sponsors : [sponsors]

    const { id } = block
    const sectionResources = resources.filter(r => sponsorsIds.includes(r.id))

    if (!sectionResources.length) {
        return null
    }

    return (
        <div className="block block--resources">
            <div className="resources">
                <BlockTitle block={{ ...block, showDescription: false }} isShareable={false} />
                <div className="resources-list">
                    {sectionResources.map(resource => {
                        const url = resource.url.includes('utm_source')
                            ? resource.url
                            : `${resource.url}?utm_source=stateofjs&utm_medium=sponsor&utm_campaign=${id}`

                        return (
                            <div key={resource.name} className="resource">
                                <div className="resource-image">
                                    <div>
                                        {/* eslint-disable-next-line */}
                                        <a
                                            onClick={() => trackClick(id, resource, 'text')}
                                            href={`${url}&utm_content=textlink`}
                                            style={{
                                                backgroundImage: `url(${resource.image})`
                                            }}
                                            title={resource.name}
                                        />
                                    </div>
                                </div>
                                <div className="resource-contents">
                                    <h4 className="resource-title">
                                        <a
                                            onClick={() => trackClick(id, resource, 'text')}
                                            href={`${url}&utm_content=textlink`}
                                        >
                                            {resource.name}
                                        </a>
                                    </h4>
                                    {/*
                                    <h5 className="resource-author">{resource.author}</h5>
                                    */}
                                    <div className="resource-description">
                                        {resource.description}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="resources-sponsored">
                    <span>{translate('partners.thanks')}</span>{' '}
                    <Link to="/support">{translate('partners.learn_more')}</Link>
                </div>
            </div>
        </div>
    )
}

RecommendedResourcesBlock.propTypes = {
    section: PropTypes.string
}

export default RecommendedResourcesBlock
