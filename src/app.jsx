import {h, render, Component} from 'preact';
import Autocomplete from './preact-autocomplete.jsx';

class App extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}
	
	render() {
		const items = [
			{label: 'Value Lorem Ipsum, Value Lorem Ipsum'},
			{label: 'banana'},
			{label: 'apple'},
			{label: 'foo'},
		];

		return <Autocomplete items={items} />
	}
}


$(() => {
	render(<App />, $('#App').get(0));
})
