import { LoginView } from "Views";
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Do I really need this?
configure({ adapter: new Adapter() });

describe("<Login /> Elements test", () => {
    // Shallow - renders the component, without it's leaf nodes.
    const container = shallow(<LoginView />);

    it("should match the snapshot", () => {
        expect(container.html()).toMatchSnapshot();
    });

    it("Should have a username field", () => {
        expect(container.find(<input type="text" name="username" />));
    });

    it("Should have a password field", () => {
        expect(container.find(<input type="text" name="password" />));
    });

    it("Should have a button", () => {
        expect(container.find(<div className="Button" />));
    });
});

// Cant test functionallity because mount isn't valid for React 17.
// Mount renders the leaf nodes (input, button, etc) and allows me to send data to it,
// therefor allows me checking the response for different inputs.

// describe("<Login /> functional test", () => {
//     // mount - renders the Component's leaves too.
//     const container = mount(<LoginView></LoginView>)
//     console.log(container);
//     // it("should raise an error message", () => {
//     //     container.find(<input name="username"/>).simulate('change', {
//     //         taget: {
//     //             value: "ron"
//     //         }
//     //     });

//     //     expect(container.find(<div className="error"/>));
//     // })
// });
