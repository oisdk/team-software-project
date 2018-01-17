# Downloading the project and making changes

Before you can make changes to the code, you'll have to download it to your local machine so you can open it up in your editor. If you're already familiar with git and github, all you need to know is: don't make commits to master. Make a branch, commit on there, and make a pull request back to master. If you're not familiar, here's a short guide:

1. Download and install [github desktop](https://desktop.github.com).

   In theory, you can do all of this stuff from the command line, but it's a total headache and github desktop makes it much easier. There's also a lot of github-specific conventions that are difficult to remember (how does github handle rebasing? how exactly are commits squashed?). If you know what you're doing, feel free to ignore all the github-specific stuff, but "there be dragons" etc.
   
2. Download the repository.

   Go to [the main page for the repo](https://github.com/oisdk/team-software-project) and click the green button marked "clone or download", and then click "open in desktop" 

   ![Downloading screenshot](contributing-images/repo-downloading.png)

   This should open the project in github desktop. You'll be given a choice of where to save the project locally, and it'll download.

3. Make a branch.

   At this point, you're going to want to make a branch for your particular feature you want to add. Do this by opening github desktop, selecting the project, and clicking the "current branch" menu, and then "new":

   ![making a new branch](contributing-images/github-desktop-new-branch.png)

   Name your branch after the feature you're adding.

4. Commit to the new branch.

   Now, whenever you make changes to the project, they'll show up in green in the main pane on the right. For instance, while writing this guide, this is what the window looks like:
   
   ![changed files view](contributing-images/desktop-changed-view.png)

   Whenever you've got a small bit of work done, add a summary and hit commit. Try and make commits small, even if you can't think of a good summary for each: catching bugs is a lot easier with a granular commit history.
   
   ![committing view](contributing-images/committing-view.png)

5. Push to remote.

   Periodically, you can hit "push" in the top-right:
   
   ![push view](contributing-images/push-view.png)
   
   This will sync your branch with the copy on github's servers.
   
6. Make a pull request.

   Back on the project's web page, you can select "compare and pull request".
   
   ![pull request](contributing-images/pull-request-view.png)
   
   From here, you can add a short description of the pull request.
   
7. Code review and changes.

   Once you've made your pull request, you can still make changes to the branch it comes from. These will be added to the pull request.

8. Merge.

   Once you're happy that you've addressed everything in the code review, and all the checks have passed, you can merge your code into master.
   
9. Delete your branch.

   Don't forget to delete your branch after it was merged!

# Python

For contributing to the Python part of the project, you'll need to follow some conventions so that your code passes the continuous integration tests. These tests are run automatically on every pull request, and the results of them will show up in the code review view on github.

The Python part of the project is stored in the folder called backend: the subfolder also called backend stores the application code, and tests stores the tests.

If you want to add to an already existing file, you'll need to do 4 things to pass the continuous integration tests:

1. Pass the linter.

   pylint is run over any new additions, which will enforce standard python style across the project.
   
2. Pass any already-existing tests.

   If your code changes the behaviour of other code which has tests in the project, the previous tests will need to pass.

3. Add tests to pass the coverage level.

   If you're adding a significant amount of new code, you may need to add tests to the code so that the coverage level doesn't drop too low. There are 2 ways to do this:
   
   1. Using doctest
   
      If your tests are simple and example-based, you can include them in the docstring for your new code and they'll automatically be run when testing. For example:
      
      ```python
      def double(x):
          """Returns the double of some number.
          
          >>> double(3)
          6
          
          >>> double(4)
          8
          """
          return x + x
      ```
      
      More information on doctest and the syntax for different kinds of tests is available at its [documentation page](https://docs.python.org/3.5/library/doctest.html).
      
   2. Using unittest
   
      Every module will have a corresponding test file in the tests folder. Test files are just the name of the module file prefixed with `test_`. In this file, you'll need to add a new testing method to test the functionality of your code. Information on how to do this is available at [unittest's documentation page](https://docs.python.org/3.5/library/unittest.html).
      
4. Add requirements to requirements.txt

   If your code imports a library

# Javascript

TODO
