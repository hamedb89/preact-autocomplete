import {h, render, Component, cloneElement} from 'preact';
import _ from 'lodash';
import classNames from 'classnames';

class Autocomplete extends Component {
	constructor(props) {
	  super(props);

	  this.items = [];
	  this.state = {
	  	value: '',
	  	open: false,
	  	active: 0
	  };

	  this.matchItem = this.matchItem.bind(this);
	  this.value = this.state.value;
	}

	composeEventHandlers(internal, external) {
	return external
		? e => { internal(e); external(e) } : internal
	}

	open() {
		const matchFunction = this.composeEventHandlers(this.matchItem, this.props.matchItem);

		this.items = _.filter(this.props.items, matchFunction);
		this.items = _.sortBy(this.items, ['matchCount', 'firstMatchLength'], ['desc', 'desc']);
		return this.items.length > 0 && this.state.open;
	}

	matchItem(item) {
		const values = this.state.value.split(" ").join("|");

		const regex = RegExp(values, 'gi');
		const match = item.label.match(regex);
		item.match = match ? match : [''];
		item.matchCount = item.match.length;
		item.firstMatchLength = item.match[0].length;

		const replaceRegex = RegExp(`(${values})`, 'gi');
		item.html = item.label.replace(replaceRegex, `<span class="replacement">$&</span>`);

		return match !== null;
	}

	getItemValue(item) {
		return item.name;
	}

	onChange(e) {
	}

	onKeyUp(e) {
		this.setState({ value: e.target.value });
	}

	onKeyDown(e) {
		console.log(this.value);
		switch(e.key) {
			case 'ArrowUp':
			case 'ArrowDown':
			case 'Escape':
			case 'Enter':
				return this[`on${e.key}`].call(this, e);
		}
	}

	onBlur(e) {
		// this.setState({ open: false });
		
		if (this.props.onBlur) {
			this.props.onBlur(e);
		}
	}

	onFocus(e) {
		this.setState({ open: true });
		
		if (this.props.onFocus) {
			this.props.onFocus(e);
		}
	}

	onArrowUp(e) {
		e.preventDefault();

		if (this.state.active > 0) {
			this.setState({
				active: this.state.active-1
			});
			// this.value = this.items[this.state.active].label;
		}

		return false;
	}

	onArrowDown(e) {
		e.preventDefault();

		if (this.state.active < this.items.length-1) {

			this.setState({
				active: this.state.active+1
			});
		}

		return false;
	}

	onEscape(e) {
		this.setState({
			active: 0,
			open: false
		});
	}

	onEnter(e) {
		if (this.open()) {
			e.preventDefault();

			this.setState({
				open: false,
				value: this.items[this.state.active].label
			});

			return false;
		}
	}

	onMouseEnter(e) {
		this.setState({
			active: e.target.dataset.key
		});
	}

	onMouseLeave(e) {
	}

	onClick(e){
		e.preventDefault();

		this.setState({
			open: false,
			value: this.items[e.target.dataset.key].label
		});

		return false;
	}

	renderItems() {
		return (
			<div className="Autocomplete-items u-posAbsolute">
				{this.items.map( (item, idx) => {
					const css = classNames(
						'Autocomplete-link u-block u-linkClean',
						{ 'Autocomplete-link--isActive': this.state.active == idx }
					);

					return (
						<div className="Autocomplete-item">
							<a href="#"
								data-key={idx}
								onMouseEnter={ this.onMouseEnter.bind(this) }
								onMouseLeave={ this.onMouseLeave.bind(this) }
								onClick={ this.onClick.bind(this) }
								class={css}
								dangerouslySetInnerHTML={{__html: item.html}}></a>
						</div>
					)
				})}
			</div>
		)
	}

	render() {
		let open = this.open();

		return (
			<div className="Autocomplete u-sizeFull u-posRelative">
				<input
				{...this.props}
				onChange={ this.onChange.bind(this) }
				onKeyUp={ this.onKeyUp.bind(this) }
				onKeyDown={ this.onKeyDown.bind(this) }
				onBlur={ this.onBlur.bind(this) }
				onFocus={ this.onFocus.bind(this) }
				type="text"
				autocomplete="off"
				value={this.state.value}
				/>

				{ open && this.renderItems() }
			</div>
		)
	}
}

export {
	Autocomplete as default
}
