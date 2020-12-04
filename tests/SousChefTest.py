from selenium import webdriver
import selenium.common.exceptions as selEx
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import time

# # GLOBALS # #
# Backtrace messages
#   Give to tests to provide context
message_home_page = "Testing home page."
message_search_result_page = "Testing search results page."
message_single_recipe_page = "Testing single recipe page."
message_test_page = "Testing test page."
message_profile_page = "Testing profile page."
message_login_page = "Testing login page."
message_favorite_recipes_page = "Testing favorite recipes page."
message_allergens_page = "Testing allergens page."

# Context Variables #
# Local addresses
# addr_home = "http://127.0.0.1:3000"
# addr_search_result_page = "http://127.0.0.1:3000/SearchResult"
# addr_single_recipe_test = "http://127.0.0.1:3000/SingleRecipeTest"
# addr_test = "http://127.0.0.1:3000/test"
# addr_profile = "http://127.0.0.1:3000/profile"
# addr_login = "http://127.0.0.1:3000/login"
# addr_favorite_recipes = "http://127.0.0.1:3000/favorite_recipes"
# addr_allergens = "http://127.0.0.1:3000/allergens"

# Live addresses
addr_home = "https://sous-chef-recipe.herokuapp.com/"
addr_search_result_page = "https://sous-chef-recipe.herokuapp.com/SearchResult"
addr_single_recipe_test = "https://sous-chef-recipe.herokuapp.com/SingleRecipeTest"
addr_test = "https://sous-chef-recipe.herokuapp.com/test"
addr_profile = "https://sous-chef-recipe.herokuapp.com/profile"
addr_login = "https://sous-chef-recipe.herokuapp.com/login"
addr_favorite_recipes = "https://sous-chef-recipe.herokuapp.com/favorite_recipes"
addr_allergens = "https://sous-chef-recipe.herokuapp.com/allergens"


# # Test Suite # #
def main():
    # Setup driver framework
    driver = webdriver.Firefox()

    # Start Tests
    print("Test Suite Starting")

    print("Testing home page...")
    test_site(driver, addr_home, message_home_page)                         # Get home page
    test_title(driver, message_home_page)                                   # Make sure title is correct
    test_header(driver, message_home_page)                                  # Make sure header is present
    test_footer(driver, message_home_page)                                  # Make sure footer is present
    element_login_button = test_login_exists(driver, message_home_page)     # Get login button
    element_search_bar = test_search_bar_exists(driver, message_home_page)  # Get search bar

    print("Testing search result...")
    test_search_bar_search(driver, element_search_bar, message_home_page)           # Test search bar
    test_site(driver, addr_search_result_page, message_search_result_page)          # Get search results page
    test_header(driver, message_search_result_page)                                 # Make sure header is present
    test_footer(driver, message_search_result_page)                                 # Make sure footer is present
    element_login_button = test_login_exists(driver, message_search_result_page)    # Make sure login button is present
    
    print("Testing single recipe page...")
    test_site(driver, addr_single_recipe_test, message_single_recipe_page)          # Get single recipe page
    test_header(driver, message_single_recipe_page)                                 # Make sure header is present
    test_footer(driver, message_single_recipe_page)                                 # Make sure footer is present
    element_login_button = test_login_exists(driver, message_single_recipe_page)    # Make sure login button is present
    
    print("Testing test page...")
    test_site(driver, addr_test, message_test_page)                         # Get test page
    test_header(driver, message_test_page)                                  # Make sure header is present
    test_footer(driver, message_test_page)                                  # Make sure footer is present
    element_login_button = test_login_exists(driver, message_test_page)     # Make sure login button is present

    print("Testing login page...")
    test_site(driver, addr_login, message_login_page)   # Get login page
    test_header(driver, message_login_page)             # Make sure header is present
    test_footer(driver, message_login_page)             # Make sure footer is present
    test_login_page(driver, message_login_page)         # Test login functionality

    print("Testing profile page...")
    test_site(driver, addr_profile, message_profile_page)   # Get profile page
    test_header(driver, message_profile_page)               # Make sure header is present
    test_footer(driver, message_profile_page)               # Make sure footer is present
    test_profile_page(driver, message_profile_page)         # Test key elements of profile page

    # print("Testing favorite recipes page...")
    # test_site(driver, addr_favorite_recipes, message_favorite_recipes_page)     # Get favorite recipe page
    # test_header(driver, message_favorite_recipes_page)                          # Make sure header is present
    # test_footer(driver, message_favorite_recipes_page)                          # Make sure footer is present
    # test_favorite_recipes(driver, message_favorite_recipes_page)                # Test key elements of favorites page
    #
    # print("Testing allergens page...")
    # test_site(driver, addr_allergens, message_allergens_page)   # Get allergens page
    # test_header(driver, message_allergens_page)                 # Make sure header is present
    # test_footer(driver, message_allergens_page)                 # Make sure footer is present
    # test_allergens(driver, message_allergens_page)              # Test key elements of allergens page
    #
    print("Tests Completed")


# Test if site is functioning
def test_site(driver, site_url, message):
    try:
        driver.get(site_url)    # Navigate to given site
    except selEx.WebDriverException as e:
        print("Test Failed: ", message, " Could not reach site.\n", e)


# Test site title, mainly just a test of the test suite
def test_title(driver, message):
    try:
        assert "Sous Chef" in driver.title  # Make sure title is on given page
    except AssertionError:
        print("Test Failed: ", message, " Title is incorrect.")


# Test footer, get footer text.
def test_footer(driver, message):
    try:
        footer_text = driver.find_element_by_id("test_footer_text")     # Footer text should be present on page
    except selEx.NoSuchElementException as e:
        print("Test Failed: ", message, " Footer is not on page.\n", e)


# Test header,
#   get main menu link
def test_header(driver, message):
    try:
        sous_chef_image = driver.find_element_by_id("test_nav_logo_image")  # Header image should be present on page
    except selEx.NoSuchElementException as e:
        print("Test Failed: ", message, " Header is not on page.\n", e)


# Test if the search bar is present on the current page
#   Returns search bar element if it passes
def test_search_bar_exists(driver, message):
    try:
        search_bar = driver.find_element_by_id("test_search_bar_input")     # Find search bar on given page
        return search_bar
    except selEx.NoSuchElementException as e:
        print("Test Failed: ", message, " Search Bar is not on page.\n", e)


# Test the search bar:
#   send a string and press enter
def test_search_bar_search(driver, search_bar, message):
    helper_search(search_bar, message)  # Enter search value
    helper_results(driver, message)     # Get search results
    helper_recipe(driver, message)      # Examine recipe


# Enter the given phrase into the search bar
def helper_search(search_bar, message):
    try:
        search_phrase = "pumpkin, pie"  # Chosen phrase

        # In the search bar element, enter the chosen search_phrase and then press enter
        search_bar.send_keys(search_phrase, Keys.RETURN)

        time.sleep(5)   # Give site time to load results

    except selEx.NoSuchElementException as e:
        print("Test Failed: ", message, " Search error, problem searching for phrase.\n", e)


# Get search results and navigate through results page
def helper_results(driver, message):
    try:
        # Check elements in results page
        test_login_exists(driver, message_search_result_page)
        test_search_result_searchbar_exists(driver, message_search_result_page)
        result_card = driver.find_element_by_id("test_search_result_recipe_card")
        result_text = driver.find_element_by_id("test_search_result_recipe_title")

        # Get page navigation
        prev_page = driver.find_element_by_id("test_search_result_navbutton_prev")  # Previous page button
        next_page = driver.find_element_by_id("test_search_result_navbutton_next")  # Next page button

        # Test page navigation
        next_page.click()   # Go forward a page
        next_page.click()   # Go forward a page
        prev_page.click()   # Go backwards a page
        prev_page.click()   # Go backwards a page

    except selEx.NoSuchElementException as e:
        print("Test Failed: ", message, " Search error, problem fetching results.\n", e)


# Get specific recipe from search results
def helper_recipe(driver, message):
    try:
        # Click on the first recipe result
        driver.find_element_by_id("test_search_result_recipe_card").click()

        # Give site time to load results
        time.sleep(5)

        # Test the contents of the clicked recipe
        #   This is testing the SingleRecipe page
        result_title = driver.find_element_by_id('test_single_recipe_title')
        result_per_serving = driver.find_elements_by_id("test_single_recipe_nutrients")
        result_recipe_step = driver.find_elements_by_id("test_single_recipe_instructions")
        result_ingredients = driver.find_elements_by_id("test_single_recipe_ingredients")
        result_nutrition_calories = driver.find_element_by_id("test_single_recipe_calories")
        result_nutrition_yield = driver.find_element_by_id("test_single_recipe_serving")
        result_nutrition_timing = driver.find_element_by_id("test_single_recipe_cook_time")
        result_recipe_image = driver.find_element_by_id("test_single_recipe_image")

        test_login_exists(driver, message_single_recipe_page)   # Test login page on SingleRecipe page

    except selEx.NoSuchElementException as e:
        print("Test Failed: ", message, " Search error, problem viewing single recipe.\n", e)


# Test if the login button is present on the current page
#   Return login element if it passes
def test_login_exists(driver, message):
    try:
        login_button = driver.find_element_by_id("test_nav_login_button")
        return login_button
    except selEx.NoSuchElementException as e:
        print("Test Failed: ", message, " Login button is not on page.\n", e)


# Check if the searchbar on a search result page is present
def test_search_result_searchbar_exists(driver, message):
    try:
        searchbar = driver.find_element_by_id("test_search_result_searchbar")
    except selEx.NoSuchElementException as e:
        print("Test Failed: ", message, " Local searchbar is not on page.\n", e)


# Test the profile page
#   Tests key elements on page
def test_profile_page(driver, message):
    try:
        # Log into site
        test_site(driver, addr_login, message_login_page)   # Get login page (needed for login)
        helper_log_in(driver, message)                      # Log in

        # Test Personal Page
        helper_personal_page(driver, message)

    except selEx.NoSuchElementException as e:
        print("Test Failed: ", message, " Profile Page encountered error.\n", e)


# Test the personal page
def helper_personal_page(driver, message):
    # Get dropdown menu for account
    account_button = driver.find_element_by_id("menu-button--menu--1")  # Get button for account (id is modular)
    account_button.click()  # Click button

    # Click settings
    setting_button = driver.find_element_by_id("option-0--menu--1")  # Get logout button
    hover = ActionChains(driver).move_to_element(setting_button)  # Set up hover, to cause website effect
    hover.perform()  # Hover the button
    setting_button.click()  # Click logout

    time.sleep(5)  # Give site time to load results

    # Test personal page

    # Test static elements
    personal_button = driver.find_element_by_id("test_personal_page_personal_button")

    # Test settings page
    personal_button.click()
    email_input = driver.find_element_by_id("test_personal_page_setting_email")
    first_name_input = driver.find_element_by_id("test_personal_page_setting_first_name")
    last_name_input = driver.find_element_by_id("test_personal_page_setting_last_name")
    password_input = driver.find_element_by_id("test_personal_page_setting_password")
    setup_button = driver.find_element_by_id("test_personal_page_setting_submit_button")

    # Test favorites page
    favorite_button = driver.find_element_by_id("test_personal_page_tabs_favorite_button")
    favorite_button.click()  # Click logout
    time.sleep(2)  # Give site time to load results
    if "FAVORITE RECIPES" in driver.page_source:
        print("\tFavorites Page Valid")
    else:
        print("\tFavorites Page Invalid")

    # Test staples page
    preference_button = driver.find_element_by_id("test_personal_page_tabs_preferrence_button")
    preference_button.click()  # Click logout
    time.sleep(2)  # Give site time to load results
    if "Staples" in driver.page_source:
        print("\tPreference Page Valid")
    else:
        print("\tPreference Page Invalid")


# Test the login page
#   Get key elements of page, prep for login
def test_login_page(driver, message):
    try:
        sign_in_container = driver.find_element_by_id("test_login_sign_in_container")
        login_container = driver.find_element_by_id("test_login_create_account_container")

        helper_log_in(driver, message)
        helper_log_out(driver, message)
    except selEx.NoSuchElementException as e:
        print("Test Failed: ", message, " Profile Page encountered error.\n", e)


# Log in with test credentials
def helper_log_in(driver, message):
    try:
        email_input = driver.find_element_by_id("test_account_form_email_input")    # Email input string
        test_email = "no@yes.com"                                                   # Test email address
        email_input.send_keys(test_email)                                           # Input text

        password_input = driver.find_element_by_id("test_account_form_password_input")  # Password input string
        test_p = "maybe"                                                                # Super secret
        password_input.send_keys(test_p)                                                # Input text

        submit_button = driver.find_element_by_id("test_account_form_submit_button")    # Button to log in
        submit_button.click()                                                           # Click button

        time.sleep(5)   # Give site time to load results

        # Check if logged in
        test_site(driver, addr_home, message_login_page)
        if "Hi, no!" in driver.page_source:
            print("\tLogin Successful")
        else:
            print("\tLogin Failed")
    except selEx.NoSuchElementException as e:
        print("Test Failed: ", message, " Error in Login.\n", e)


# Log out of test account
def helper_log_out(driver, message):
    try:
        # Get dropdown menu for account
        account_button = driver.find_element_by_id("menu-button--menu--1")  # Get button for account (id is modular)
        account_button.click()                                              # Click button

        # Click logout
        log_out_button = driver.find_element_by_id("option-3--menu--1")     # Get logout button
        hover = ActionChains(driver).move_to_element(log_out_button)        # Set up hover, to cause website effect
        hover.perform()                                                     # Hover the button
        log_out_button.click()                                              # Click logout

        time.sleep(5)   # Give site time to load results

        test_login_exists(driver, message_login_page)   # Make sure login button has returned
        if "Log in" in driver.page_source:
            print("\tLogout Successful")
        else:
            print("\tLogout Failed")
    except selEx.NoSuchElementException as e:
        print("Test Failed: ", message, " Error in Logout.\n", e)


# Test the favorite recipes page
#   Assumes user is logged in
#   Get key elements from page
#   Test returned recipe
def test_favorite_recipes(driver, message):
    try:
        personal_button = driver.find_element_by_id("test_favorite_recipes_page_personal_button")
        favorite_button = driver.find_element_by_id("test_favorite_recipes_page_favorite_button")
        allergen_button = driver.find_element_by_id("test_favorite_recipes_page_allergen_button")

        user_image = driver.find_element_by_id("test_favorite_recipes_page_user_image")

        recipe = driver.find_element_by_id("test_favorite_recipes_page_recipe")
    except selEx.NoSuchElementException as e:
        print("Test Failed: ", message, " Favorite Recipes Page encountered error.\n", e)


# Test the allergens page
#   Assumes user is logged in
#   Get key elements from page
def test_allergens(driver, message):
    try:
        personal_button = driver.find_element_by_id("test_allergens_page_personal_button")
        favorite_button = driver.find_element_by_id("test_allergens_page_favorite_button")
        allergen_button = driver.find_element_by_id("test_allergens_page_allergen_button")

        user_image = driver.find_element_by_id("test_allergens_page_user_image")

        search_allergen = driver.find_element_by_id("test_allergens_page_search_bar")
        allergen_list = driver.find_element_by_id("test_allergens_page_allergen_list")
    except selEx.NoSuchElementException as e:
        print("Test Failed: ", message, " Allergens Page encountered error.\n", e)


if __name__ == "__main__":
    main()

