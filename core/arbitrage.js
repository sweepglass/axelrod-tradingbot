'use strict';

var lodash = require('lodash');

function getFunds() {
		return 1000.00;
}

let lastOpportunity = { id: null };

exports.checkOpportunity = async function(prices) {

	let bestBid = lodash.maxBy(prices, function(item){ return item.bid })
	let bestAsk = lodash.minBy(prices, function(item){ return item.ask })

	if (bestBid.bid > bestAsk.ask) {

		let funds = getFunds();
		let amount = funds / bestAsk.ask;

		let bought = bestAsk.ask * amount;
		let sould = bestBid.bid * amount;

		let cost = (bought * bestAsk.cost) + (sould * bestBid.cost);

		let estimatedGain = (sould - (bought + cost)).toFixed(2);
		let percentage = ((estimatedGain / funds) * 100).toFixed(2);

		let opportunity = {
			id: bestAsk.ticket + '-' + bestAsk.name + bestBid.name,
			amount: amount.toFixed(8),
			buy_at: bestAsk.name,
			ask: bestAsk.ask.toFixed(2),
			sale_at: bestBid.name,
			bid: bestBid.bid.toFixed(2)
		}

		if (lastOpportunity.id != opportunity.id && percentage >= 1.00)  {

			console.log('');
			console.info('✔ Opportunity found:');
			console.info('  Estimated gain:', percentage, '% |', estimatedGain);
			console.info('\n', opportunity);
			lastOpportunity = opportunity;

		} else if (lastOpportunity.id === opportunity.id && percentage < 1.00) {

			console.log('');
			console.info('✔ Opportunity closed.');
			lastOpportunity = { id: null };

		}

	}

}
