import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import qwest from 'qwest';
import Product from 'Product';

const api = {
    baseUrl: 'http://marketplace.alifca.com/api/mobile/products',
};

class Listing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tracks: [],
            hasMoreItems: true,
            page: 1
        };

    }
    loadItems(page) {
        let self = this;

        let url = api.baseUrl;

        qwest.get(url, {
            items_per_page: 40,
            page: this.state.page,
            tiw: 200,
            hiw: 200
        }, {
            cache: true
        })
            .then(function (xhr, resp) {

              if (resp) {
                    let tracks = self.state.tracks;
                    tracks = (resp.params.page > 1) ? [...tracks, ...resp.products] : resp.products;

                    if (resp.params.page > 0) {
                        self.setState({
                            tracks: tracks,
                            page: resp.params.page + 1
                        });
                    } else {
                        self.setState({
                            hasMoreItems: false
                        });
                    }
                }
            });
    }
    render() {
        const loader = <div className="loader">Loading ...</div>;

        let items = [];
        this.state.tracks.map((track, i) => {

            items.push(
                <Product
                    image={ (track.main_pair) ? track.main_pair.detailed.mobile_image_path : "./assets/images/300x300.png"}
                    price={ (track.price)? track.price.price : 0}
                    key={i}
                />
            );
            // items.push(
            //     <div className="cell" key={i}>
            //         <div className="card custom-card" data-open="product-detail">
            //             <img className="image-cs" src={ (track.main_pair) ? track.main_pair.detailed.mobile_image_path : "./assets/images/300x300.png"} />
            //             <div>
            //                 <strong>
            //                     {(track.price) ? track.price.price : 0}
            //                 </strong>
            //                 <span className="font-10">د.إ.AED</span>
            //                 &nbsp;&nbsp;
            //                 <span className="font-9 grey-color">
            //             <strike>
            //                 {(track.price) ? track.price.price : 0}
            //                 <span className="font-10">د.إ.AED</span>
            //             </strike>
            //             </span>
            //                 <p className="font-9 grey-color">{track.price.price ? track.price.price : 0}+ bought this</p>
            //             </div>
            //         </div>
            //
            //     </div>
            // );
        });

        return (
            <div>

                <br/>
                <br/>

                <div className="grid-container grid-container-listing-special">
                    <div className="grid-x">
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={this.loadItems.bind(this)}
                            hasMore={this.state.hasMoreItems}
                            loader={loader}
                            threshold={250}
                        >

                            <div className="grid-x grid-padding-x small-up-2 medium-up-3 large-up-4">
                                {items}
                            </div>

                        </InfiniteScroll>

                    </div>
                </div>
            </div>
        );
    }
}

Listing.initialState = {
    items: []
};

module.exports = Listing;
